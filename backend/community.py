from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from auth import get_current_user
from database import SessionLocal, get_db
from models import CommunityGroup, CommunityMembership, CommunityMessage, User
from schemas import (
    CommunityGroupOut,
    CommunityMembershipOut,
    CommunityMessageCreate,
    CommunityMessageOut,
)


router = APIRouter(prefix="/community", tags=["community"])

DEFAULT_GROUPS = [
    {
        "Name": "Midlife, Together",
        "Focus": "Women in their 40s",
        "Description": "A welcoming circle for sharing the changes, questions, and small wins that come with midlife.",
        "Icon": "diversity_3",
        "Accent": "rose",
    },
    {
        "Name": "Sleep & Hot Flash Circle",
        "Focus": "Sleep and symptoms",
        "Description": "Swap everyday experiences and encouragement around sleep, temperature changes, and feeling more comfortable.",
        "Icon": "bedtime",
        "Accent": "plum",
    },
    {
        "Name": "Stronger at Every Age",
        "Focus": "Movement and strength",
        "Description": "Celebrate realistic movement goals, gentle routines, and the strength you are building at your own pace.",
        "Icon": "fitness_center",
        "Accent": "sage",
    },
    {
        "Name": "The Mindful Pause",
        "Focus": "Mindfulness and wellbeing",
        "Description": "A calm space for mindful moments, self-kindness, and staying connected through life's transitions.",
        "Icon": "self_improvement",
        "Accent": "gold",
    },
]


def seed_community_groups() -> None:
    db = SessionLocal()
    try:
        existing_names = {
            name
            for (name,) in db.query(CommunityGroup.Name).all()
        }
        new_groups = [
            CommunityGroup(**group)
            for group in DEFAULT_GROUPS
            if group["Name"] not in existing_names
        ]
        if new_groups:
            db.add_all(new_groups)
            db.commit()
    finally:
        db.close()


def get_group_or_404(db: Session, group_id: int) -> CommunityGroup:
    group = db.query(CommunityGroup).filter(
        CommunityGroup.GroupID == group_id
    ).first()
    if not group:
        raise HTTPException(status_code=404, detail="Community group not found.")
    return group


def require_membership(db: Session, group_id: int, user_id: int) -> CommunityGroup:
    group = get_group_or_404(db, group_id)
    membership = db.query(CommunityMembership.MembershipID).filter(
        CommunityMembership.GroupID == group_id,
        CommunityMembership.UserID == user_id,
    ).first()
    if not membership:
        raise HTTPException(
            status_code=403,
            detail="Join this group to view or send messages.",
        )
    return group


def serialize_message(message: CommunityMessage, author: str, user_id: int):
    return {
        "messageId": message.MessageID,
        "groupId": message.GroupID,
        "userId": message.UserID,
        "author": author,
        "content": message.Content,
        "createdAt": message.CreatedAt,
        "isMine": message.UserID == user_id,
    }


@router.get("/groups", response_model=List[CommunityGroupOut])
def list_community_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    groups = db.query(CommunityGroup).order_by(CommunityGroup.GroupID).all()
    memberships = db.query(CommunityMembership.GroupID).filter(
        CommunityMembership.UserID == current_user.UserID
    ).all()
    joined_group_ids = {group_id for (group_id,) in memberships}
    counts = dict(
        db.query(
            CommunityMembership.GroupID,
            func.count(CommunityMembership.MembershipID),
        )
        .group_by(CommunityMembership.GroupID)
        .all()
    )

    return [
        {
            "groupId": group.GroupID,
            "name": group.Name,
            "focus": group.Focus,
            "description": group.Description,
            "icon": group.Icon,
            "accent": group.Accent,
            "memberCount": counts.get(group.GroupID, 0),
            "isMember": group.GroupID in joined_group_ids,
        }
        for group in groups
    ]


@router.post(
    "/groups/{group_id}/join",
    response_model=CommunityMembershipOut,
)
def join_community_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_group_or_404(db, group_id)
    membership = db.query(CommunityMembership).filter(
        CommunityMembership.GroupID == group_id,
        CommunityMembership.UserID == current_user.UserID,
    ).first()
    if membership:
        return {"groupId": group_id, "isMember": True}

    db.add(
        CommunityMembership(
            GroupID=group_id,
            UserID=current_user.UserID,
            JoinedAt=datetime.utcnow(),
        )
    )
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        existing_membership = db.query(CommunityMembership.MembershipID).filter(
            CommunityMembership.GroupID == group_id,
            CommunityMembership.UserID == current_user.UserID,
        ).first()
        if not existing_membership:
            raise

    return {"groupId": group_id, "isMember": True}


@router.delete(
    "/groups/{group_id}/join",
    response_model=CommunityMembershipOut,
)
def leave_community_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_group_or_404(db, group_id)
    membership = db.query(CommunityMembership).filter(
        CommunityMembership.GroupID == group_id,
        CommunityMembership.UserID == current_user.UserID,
    ).first()
    if membership:
        db.delete(membership)
        db.commit()
    return {"groupId": group_id, "isMember": False}


@router.get(
    "/groups/{group_id}/messages",
    response_model=List[CommunityMessageOut],
)
def list_group_messages(
    group_id: int,
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_membership(db, group_id, current_user.UserID)
    messages = (
        db.query(CommunityMessage, User.Name)
        .join(User, User.UserID == CommunityMessage.UserID)
        .filter(CommunityMessage.GroupID == group_id)
        .order_by(
            CommunityMessage.CreatedAt.desc(),
            CommunityMessage.MessageID.desc(),
        )
        .limit(limit)
        .all()
    )
    messages.reverse()
    return [
        serialize_message(message, author, current_user.UserID)
        for message, author in messages
    ]


@router.post(
    "/groups/{group_id}/messages",
    response_model=CommunityMessageOut,
    status_code=201,
)
def create_group_message(
    group_id: int,
    message_data: CommunityMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_membership(db, group_id, current_user.UserID)
    message = CommunityMessage(
        GroupID=group_id,
        UserID=current_user.UserID,
        Content=message_data.content,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return serialize_message(message, current_user.Name, current_user.UserID)
