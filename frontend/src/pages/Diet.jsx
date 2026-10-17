import { useCallback, useEffect, useMemo, useState } from "react"
import bananaOatSkilletImage from "../assets/recipes/banana-oat-skillet.jpeg"
import breakfastAppamKadalaImage from "../assets/recipes/breakfast-appam-kadala.jpg"
import breakfastDosaSambarImage from "../assets/recipes/breakfast-dosa-sambar.jpg"
import breakfastEggTofuVegetablesImage from "../assets/recipes/breakfast-egg-tofu-vegetables.jpg"
import breakfastIdliSambarImage from "../assets/recipes/breakfast-idli-sambar.jpg"
import breakfastKanjiPayarImage from "../assets/recipes/breakfast-kanji-payar.jpg"
import breakfastOatsFruitSeedsImage from "../assets/recipes/breakfast-oats-fruit-seeds.jpg"
import chickpeaVegetableSaladImage from "../assets/recipes/chickpea-vegetable-salad.jpeg"
import fruitYogurtBowlImage from "../assets/recipes/fruit-yogurt-bowl.jpeg"
import keralaAppamImage from "../assets/recipes/kerala-appam-stew.jpg"
import keralaAviyalImage from "../assets/recipes/kerala-aviyal.jpg"
import keralaFishCurryImage from "../assets/recipes/kerala-fish-curry.jpg"
import keralaIdiyappamImage from "../assets/recipes/kerala-idiyappam-vegetable-stew.jpg"
import keralaKozhukattaImage from "../assets/recipes/kerala-kozhukatta.jpg"
import keralaParippuVadaImage from "../assets/recipes/kerala-parippu-vada.jpg"
import keralaPazhamPoriImage from "../assets/recipes/kerala-pazham-pori.jpg"
import keralaPuttuImage from "../assets/recipes/kerala-puttu-kadala.jpg"
import keralaSadyaImage from "../assets/recipes/kerala-sadya.jpg"
import keralaSamosaImage from "../assets/recipes/kerala-samosa.jpg"
import keralaUnniyappamImage from "../assets/recipes/kerala-unniyappam.jpg"
import paneerVegetableWrapImage from "../assets/recipes/paneer-vegetable-wrap.jpeg"
import snackParippuVadaImage from "../assets/recipes/snack-parippu-vada.jpg"
import snackPazhamPoriImage from "../assets/recipes/snack-pazham-pori.jpg"
import snackRoastedBananaNutsImage from "../assets/recipes/snack-roasted-banana-nuts.jpg"
import snackSamosaImage from "../assets/recipes/snack-samosa.jpg"
import vegetableOatsBowlImage from "../assets/recipes/vegetable-oats-bowl.jpeg"
import vegetableOmeletteImage from "../assets/recipes/vegetable-omelette.jpeg"
import vegetableRiceBowlImage from "../assets/recipes/vegetable-rice-bowl.jpeg"
import vegetableSoupImage from "../assets/recipes/vegetable-soup.jpeg"

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

const trackedMealTypes = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
]

const plannerDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const keralaRecipeDetails = [
  {
    RecipeID: "local-kerala-puttu",
    Name: "Puttu with Kadala Curry",
    MealType: "Breakfast",
    CookingTime: "45 minutes, plus chickpea soaking",
    Ingredients:
      "For puttu: 2 cups puttu podi (rice flour), 1/2 cup grated coconut, about 3/4 cup water, salt. For kadala curry: 1 cup dried black chickpeas, 1 onion, 1 tomato, 1 teaspoon ginger-garlic, curry leaves, turmeric, coriander and chilli powder, oil, salt.",
    Instructions:
      "Soak the black chickpeas overnight, then pressure-cook until tender. For the curry, soften onion with curry leaves; add ginger-garlic, tomato, turmeric, coriander and chilli powder. Add the cooked chickpeas with some cooking liquid and simmer until thick. Mix salt into the rice flour and sprinkle in water gradually until it resembles damp crumbs when pressed. Layer the flour and grated coconut in a puttu steamer and steam for about 8–10 minutes, until hot and cooked through. Serve together.",
    Notes: "Traditional Kerala breakfast. Seasonings and water vary by rice flour; add water gradually.",
    SearchTerms: "puttu with kadala curry|puttu and kadala curry|puttu",
  },
  {
    RecipeID: "local-kerala-appam",
    Name: "Palappam with Vegetable Stew",
    MealType: "Breakfast",
    CookingTime: "40 minutes, plus batter fermentation",
    Ingredients:
      "For appam: 2 cups raw rice, 1/2 cup cooked rice, 1/2 cup coconut milk, yeast, sugar, salt, water. For stew: potato, carrot, green beans, onion, ginger, curry leaves, thin and thick coconut milk, whole spices.",
    Instructions:
      "Soak the raw rice, then grind with cooked rice, coconut milk and enough water to make a smooth batter. Activate the yeast with a little warm water and sugar, mix into the batter and leave covered until risen. Season with salt. For the stew, gently cook onion, ginger, curry leaves and whole spices; add vegetables and thin coconut milk and simmer until tender. Finish with thick coconut milk without boiling hard. Pour a ladle of batter into a hot appachatti, swirl to coat the sides, cover and cook until the centre is set and the edge is lacy. Serve with stew.",
    Notes: "Fermentation time depends on room temperature and yeast; appam is cooked in an appachatti.",
    SearchTerms: "palappam with vegetable stew|palappam",
  },
  {
    RecipeID: "local-kerala-avial",
    Name: "Avial",
    MealType: "Lunch",
    CookingTime: "35 minutes",
    Ingredients:
      "3 cups mixed firm vegetables (such as drumstick, carrot, green beans, raw plantain, yam or ash gourd), 1 cup grated coconut, 1 teaspoon cumin, 2 green chillies, 1/2 cup thick yogurt, curry leaves, coconut oil, salt.",
    Instructions:
      "Cut vegetables into even batons. Cook the firmer vegetables first with salt and a small splash of water; add quicker-cooking vegetables later and cook until just tender, not mushy. Coarsely grind coconut, cumin and green chillies. Fold this mixture into the vegetables and warm gently for a few minutes. Turn off the heat, stir in whisked yogurt, curry leaves and a drizzle of coconut oil. Do not boil after adding the yogurt. Serve as a side with rice.",
    Notes: "Kerala-style mixed vegetable avial; vegetable combinations vary by household and season.",
    SearchTerms: "avial|aviyal",
  },
]

const mealSuggestionRecipeDetails = [
  {
    Name: "Oats with Fruit and Seeds",
    MealType: "Breakfast",
    CookingTime: "10 minutes",
    SearchTerms: "oats with fruit and seeds|oats fruit seeds",
    Ingredients:
      "1/2 cup rolled oats, 1 cup milk or fortified soy milk, 1/2 cup chopped seasonal fruit, 1 tablespoon mixed seeds, and cinnamon to taste.",
    Instructions:
      "Simmer the oats with milk or water, stirring until soft. Spoon into a bowl and top with fruit, seeds, and cinnamon.",
  },
  {
    Name: "Eggs or Tofu with Vegetables",
    MealType: "Breakfast",
    CookingTime: "15 minutes",
    SearchTerms: "eggs or tofu with vegetables|egg tofu vegetables",
    Ingredients:
      "2 eggs or 150 g firm tofu, 1 cup chopped vegetables such as spinach, tomato, and capsicum, 1 teaspoon oil, and salt and pepper.",
    Instructions:
      "Heat the oil and cook the vegetables until tender. For eggs, whisk and pour them into the pan, stirring until set. For tofu, crumble it into the pan and cook with the vegetables for 4–5 minutes. Season and serve.",
  },
  {
    Name: "Idiyappam with Egg Curry",
    MealType: "Breakfast",
    CookingTime: "40 minutes",
    SearchTerms: "idiyappam with egg curry|idiyappam egg curry",
    Ingredients:
      "For idiyappam: rice flour, hot water, salt, and grated coconut. For curry: boiled eggs, onion, tomato, ginger, garlic, curry leaves, turmeric, chilli powder, coriander powder, and oil.",
    Instructions:
      "Mix rice flour and salt, then add hot water gradually to form a soft dough. Press into nests, sprinkle with coconut, and steam until cooked. For the curry, soften onion with curry leaves, ginger, and garlic; add tomato and spices and cook until soft. Add water and simmer, then add the boiled eggs and heat through.",
  },
  {
    Name: "Dosa with Sambar",
    MealType: "Breakfast",
    CookingTime: "35 minutes",
    SearchTerms: "dosa with sambar|dosa sambar",
    Ingredients:
      "Fermented dosa batter, 1/2 cup toor dal, 2 cups chopped mixed vegetables, tomato, tamarind, sambar powder, mustard seeds, curry leaves, and oil.",
    Instructions:
      "Cook the dal until soft. Simmer the vegetables with tomato, tamarind, and sambar powder until tender; stir in the dal and simmer. Temper mustard seeds and curry leaves in oil and add to the sambar. Spread dosa batter thinly on a hot griddle and cook until crisp at the edges, then serve with sambar.",
  },
  {
    Name: "Idli with Sambar",
    MealType: "Breakfast",
    CookingTime: "30 minutes",
    SearchTerms: "idli with sambar|idli sambar",
    Ingredients:
      "Fermented idli batter, 1/2 cup toor dal, 2 cups chopped mixed vegetables, tomato, tamarind, sambar powder, mustard seeds, curry leaves, and oil.",
    Instructions:
      "Pour the batter into greased idli moulds and steam until set. Cook the dal until soft. Simmer vegetables with tomato, tamarind, and sambar powder, stir in the dal, and cook until tender. Finish with mustard seeds and curry leaves tempered in oil; serve with the idli.",
  },
  {
    Name: "Appam with Kadala Curry",
    MealType: "Breakfast",
    CookingTime: "45 minutes plus batter fermentation",
    SearchTerms: "appam with kadala curry|appam kadala curry",
    Ingredients:
      "Fermented appam batter. For kadala curry: 1 cup dried black chickpeas, onion, tomato, ginger, garlic, curry leaves, turmeric, coriander powder, chilli powder, and oil.",
    Instructions:
      "Soak the chickpeas overnight, then pressure-cook until tender. Soften onion with curry leaves, ginger, and garlic; add tomato and spices and cook until soft. Add the chickpeas with some cooking liquid and simmer until the curry thickens. Pour batter into a hot appachatti, swirl, cover, and cook until the centre is set and the edges are lacy. Serve together.",
  },
  {
    Name: "Kanji with Payar",
    MealType: "Breakfast",
    CookingTime: "45 minutes",
    SearchTerms: "kanji with payar|rice kanji cherupayar|kanji payar",
    Ingredients:
      "1/2 cup rice, 4 cups water, 1/2 cup whole green gram (cherupayar), 1 garlic clove, cumin, salt, and a vegetable thoran to serve.",
    Instructions:
      "Simmer the rice in water until very soft and porridge-like, adding more water if needed. Separately cook soaked green gram until tender, then season with crushed garlic, cumin, and salt. Serve the kanji with payar and thoran.",
  },
  {
    Name: "Dal, Rice, and Vegetables",
    MealType: "Lunch",
    CookingTime: "35 minutes",
    SearchTerms: "dal rice and vegetables|dal rice vegetables",
    Ingredients:
      "1/2 cup lentils, 1/2 cup rice, 2 cups mixed vegetables, onion, tomato, turmeric, cumin, salt, and oil.",
    Instructions:
      "Rinse and cook the rice. Simmer lentils with turmeric until soft. Cook onion, tomato, and vegetables with a little water until tender; stir in the lentils and season. Serve the dal and vegetables with rice.",
  },
  {
    Name: "Chickpea or Paneer Bowl",
    MealType: "Lunch",
    CookingTime: "20 minutes",
    SearchTerms: "chickpea or paneer bowl|chickpea paneer bowl",
    Ingredients:
      "1 cup cooked chickpeas or 150 g paneer, 1/2 cup cooked whole grain, 1 cup chopped vegetables, lemon juice, cumin, and plain yogurt or chutney to serve.",
    Instructions:
      "Warm the chickpeas with cumin and a splash of water, or lightly brown the paneer in a pan. Arrange over the cooked grain with the vegetables. Finish with lemon juice and yogurt or chutney.",
  },
  {
    Name: "Kerala Matta Rice Meal",
    MealType: "Lunch",
    CookingTime: "50 minutes",
    SearchTerms: "kerala matta rice meals|matta rice meal",
    Ingredients:
      "Kerala matta rice, mixed vegetables, grated coconut, cumin, green chilli, yogurt, curry leaves, coconut oil, and parippu or sambar.",
    Instructions:
      "Rinse and cook the matta rice until tender. Prepare a vegetable side by cooking mixed vegetables until just tender, then fold in a coarse paste of coconut, cumin, and green chilli. Finish with curry leaves and coconut oil. Serve with parippu or sambar.",
  },
  {
    Name: "Avial with Matta Rice",
    MealType: "Lunch",
    CookingTime: "45 minutes",
    SearchTerms: "avial and matta rice|avial with matta rice|aviyal matta rice",
    Ingredients:
      "1/2 cup Kerala matta rice, 3 cups mixed vegetables, 1 cup grated coconut, cumin, green chillies, 1/2 cup yogurt, curry leaves, coconut oil, and salt.",
    Instructions:
      "Cook the rice until tender. Cut the vegetables into even pieces and cook with salt and a splash of water until just tender. Coarsely grind coconut, cumin, and green chillies; fold into the vegetables and warm briefly. Turn off the heat, stir in whisked yogurt, curry leaves, and coconut oil. Serve with the rice.",
  },
  {
    Name: "Thoran with Matta Rice",
    MealType: "Lunch",
    CookingTime: "35 minutes",
    SearchTerms: "thoran with matta rice|cabbage thoran with matta rice",
    Ingredients:
      "1/2 cup Kerala matta rice, 2 cups finely chopped cabbage or beans, 1/3 cup grated coconut, shallots, green chilli, mustard seeds, curry leaves, turmeric, and oil.",
    Instructions:
      "Rinse and cook the matta rice until tender. Cook the chopped vegetables with shallots, chilli, turmeric, and a splash of water until just tender. Stir in grated coconut. Temper mustard seeds and curry leaves in oil, toss through the thoran, and serve with rice.",
  },
  {
    Name: "Kerala Fish Curry with Matta Rice",
    MealType: "Lunch",
    CookingTime: "40 minutes",
    SearchTerms: "kerala fish curry meal|fish curry with matta rice|fish curry vegetables",
    Ingredients:
      "Fish portions, 1/2 cup Kerala matta rice, shallots, ginger, garlic, kudampuli (Malabar tamarind), chilli powder, turmeric, curry leaves, and a vegetable thoran.",
    Instructions:
      "Rinse and cook the rice until tender. Soak the kudampuli. Simmer shallots, ginger, garlic, chilli, turmeric, and kudampuli with water until fragrant. Add the fish and cook gently until just done. Serve with the rice and thoran.",
  },
  {
    Name: "Sambar and Vegetable Lunch",
    MealType: "Lunch",
    CookingTime: "45 minutes",
    SearchTerms: "sambar and vegetable lunch|sambar matta rice",
    Ingredients:
      "1/2 cup Kerala matta rice, 1/2 cup toor dal, drumstick or other mixed vegetables, tomato, tamarind, sambar powder, mustard seeds, and curry leaves.",
    Instructions:
      "Rinse and cook the rice until tender. Cook the dal until soft. Simmer vegetables and tomato with tamarind and sambar powder until tender, then combine with the dal and adjust the consistency with water. Finish with mustard seeds and curry leaves tempered in oil; serve with rice.",
  },
  {
    Name: "Moru Curry with Vegetables",
    MealType: "Lunch",
    CookingTime: "30 minutes",
    SearchTerms: "moru curry and vegetables|moru curry with cabbage thoran",
    Ingredients:
      "1 cup plain yogurt, 1/2 cup water, turmeric, ginger, green chilli, grated coconut, cumin, mustard seeds, curry leaves, and a vegetable thoran to serve.",
    Instructions:
      "Whisk the yogurt with water and turmeric. Grind coconut and cumin to a paste and stir it in if desired. Warm gently with ginger and green chilli without letting the curry boil. Temper mustard seeds and curry leaves in oil and add on top. Serve with cooked rice and vegetables.",
  },
  {
    Name: "Vegetable Khichdi",
    MealType: "Dinner",
    CookingTime: "30 minutes",
    SearchTerms: "vegetable khichdi",
    Ingredients:
      "1/2 cup rice, 1/3 cup moong dal, 1 cup chopped vegetables, 1/2 teaspoon turmeric, cumin, 3 cups water, and salt.",
    Instructions:
      "Rinse the rice and dal. Add them to a pot with vegetables, turmeric, cumin, salt, and water. Simmer covered, stirring occasionally, until the rice, dal, and vegetables are soft. Add hot water for a looser consistency.",
  },
  {
    Name: "Tofu, Paneer, or Beans with Vegetables",
    MealType: "Dinner",
    CookingTime: "25 minutes",
    SearchTerms: "tofu paneer beans with cooked vegetables|tofu paneer beans vegetables",
    Ingredients:
      "150 g tofu or paneer, or 1 cup cooked beans; 2 cups chopped vegetables; onion, garlic, cumin, oil, and salt.",
    Instructions:
      "Cook onion and garlic in a little oil until soft. Add the vegetables and a splash of water; cover and cook until tender. Add tofu, paneer, or beans with cumin and salt, then heat through. Serve as a warm bowl or with cooked grain.",
  },
  {
    Name: "Lentil Soup and Roti",
    MealType: "Dinner",
    CookingTime: "35 minutes",
    SearchTerms: "lentil soup and roti|lentil soup whole grain bread",
    Ingredients:
      "1/2 cup lentils, 1/2 onion, 1 carrot, 1 tomato, 3 cups vegetable stock or water, cumin, salt, and whole-grain roti.",
    Instructions:
      "Soften the onion in a pot, then add carrot, tomato, lentils, cumin, and stock. Simmer until the lentils are soft, adding water if needed. Season and serve hot with roti.",
  },
  {
    Name: "Idiyappam with Vegetable Stew",
    MealType: "Dinner",
    CookingTime: "40 minutes",
    SearchTerms: "idiyappam with vegetable stew|idiyappam vegetable stew",
    Ingredients:
      "For idiyappam: rice flour, hot water, salt, and grated coconut. For stew: potato, carrot, green beans, onion, ginger, curry leaves, thin and thick coconut milk, and whole spices.",
    Instructions:
      "Mix rice flour and salt, then add hot water gradually to make a soft dough. Press into nests, sprinkle with coconut, and steam until cooked. For the stew, soften onion, ginger, curry leaves, and whole spices; add vegetables and thin coconut milk and simmer until tender. Stir in thick coconut milk and warm gently without boiling.",
  },
  {
    Name: "Appam with Egg Curry",
    MealType: "Dinner",
    CookingTime: "45 minutes plus batter fermentation",
    SearchTerms: "appam with egg curry|appam egg curry",
    Ingredients:
      "Fermented appam batter, 3 boiled eggs, onion, tomato, ginger, garlic, curry leaves, turmeric, chilli powder, coriander powder, and oil.",
    Instructions:
      "Pour appam batter into a hot appachatti, swirl, cover, and cook until the centre is set and the edges are lacy. For the curry, soften onion with curry leaves, ginger, and garlic; add tomato and spices and cook until soft. Add water to make a gravy, simmer, then add the boiled eggs and heat through.",
  },
  {
    Name: "Kanji, Payar, and Thoran",
    MealType: "Dinner",
    CookingTime: "50 minutes",
    SearchTerms: "kanji payar and thoran|kanji with cherupayar and thoran",
    Ingredients:
      "1/2 cup rice, 4 cups water, 1/2 cup whole green gram (cherupayar), garlic, cumin, and a small serving of cabbage or greens thoran.",
    Instructions:
      "Simmer rice with plenty of water until it becomes a soft kanji. Cook soaked green gram until tender and season with garlic, cumin, and salt. Prepare a simple vegetable thoran by cooking chopped greens or cabbage until tender and tossing with grated coconut. Serve together.",
  },
  {
    Name: "Fish Curry with Vegetables",
    MealType: "Dinner",
    CookingTime: "40 minutes",
    SearchTerms: "fish curry with vegetables|kerala fish curry with matta rice",
    Ingredients:
      "Fish portions, shallots, ginger, garlic, kudampuli (Malabar tamarind), chilli powder, turmeric, curry leaves, cooked rice, and seasonal vegetables.",
    Instructions:
      "Soak the kudampuli. Simmer shallots, ginger, garlic, chilli, turmeric, and kudampuli with water until fragrant. Add fish and cook gently until just done. Serve with cooked rice and a side of vegetables.",
  },
  {
    Name: "Pazham Pori (Banana Fritters)",
    MealType: "Snack",
    CookingTime: "25 minutes",
    SearchTerms: "pazham pori|banana fritters",
    Ingredients:
      "2 ripe nendran bananas, 1/2 cup all-purpose or rice flour, a pinch of turmeric, salt, water, and oil for frying.",
    Instructions:
      "Slice the bananas lengthwise. Mix flour, turmeric, salt, and enough water to make a smooth coating batter. Dip each slice and shallow- or deep-fry until golden, turning once. Drain and serve warm.",
  },
  {
    Name: "Parippu Vada (Lentil Fritters)",
    MealType: "Snack",
    CookingTime: "45 minutes",
    SearchTerms: "parippu vada|lentil fritters",
    Ingredients:
      "1 cup chana dal, shallots, ginger, green chilli, curry leaves, fennel, salt, and oil for frying.",
    Instructions:
      "Soak the chana dal, drain well, and pulse most of it coarsely while leaving some whole. Mix with finely chopped shallots, ginger, chilli, curry leaves, fennel, and salt. Shape into small patties and fry over medium heat until crisp and cooked through.",
  },
  {
    Name: "Kerala Vegetable Samosa",
    MealType: "Snack",
    CookingTime: "45 minutes",
    SearchTerms: "kerala style samosa|kerala vegetable samosa|vegetable samosa",
    Ingredients:
      "Samosa pastry sheets, potato, green peas, onion, ginger, green chilli, curry leaves, garam masala, coriander, and oil.",
    Instructions:
      "Cook the potato and peas until tender. Soften onion, ginger, chilli, and curry leaves in a pan; add the vegetables and garam masala and mix. Fill and seal the pastry sheets into samosas. Bake or fry until golden and crisp.",
  },
  {
    Name: "Unniyappam",
    MealType: "Snack",
    CookingTime: "35 minutes",
    SearchTerms: "unniyappam",
    Ingredients:
      "1 cup rice flour, 1 ripe banana, 1/2 cup grated jaggery, grated coconut, sesame seeds, cardamom, and ghee or oil.",
    Instructions:
      "Melt the jaggery with a little water and cool. Mix with mashed banana, rice flour, coconut, sesame, and cardamom to make a thick batter; rest briefly. Cook small portions in a lightly greased unniyappam pan, turning until browned and cooked through.",
  },
  {
    Name: "Kozhukatta (Steamed Coconut Dumplings)",
    MealType: "Snack",
    CookingTime: "40 minutes",
    SearchTerms: "kozhukatta|steamed coconut dumplings",
    Ingredients:
      "1 cup rice flour, hot water, salt, 1 cup grated coconut, 1/3 cup jaggery, and cardamom.",
    Instructions:
      "Cook the coconut with jaggery and cardamom until the filling comes together. Gradually mix hot water and salt into the rice flour to make a soft dough. Shape small cups of dough around the filling and seal. Steam until the dumplings are cooked through.",
  },
  {
    Name: "Roasted Banana and Nuts",
    MealType: "Snack",
    CookingTime: "10 minutes",
    SearchTerms: "roasted banana and nuts|banana with roasted peanuts",
    Ingredients:
      "1 ripe banana and a small handful of roasted peanuts or mixed nuts.",
    Instructions:
      "Warm the banana in a dry pan over medium heat, turning until lightly browned and heated through. Serve with the roasted nuts.",
  },
]

function normalizePantryIngredient(value) {
  const normalized = String(value || "")
    .toLowerCase()
    .replace(/\bwhole milk\b|\bfull[- ]cream milk\b|\bfull[- ]fat milk\b|\bskim milk\b|\blow[- ]fat milk\b|\bdairy milk\b/g, "milk")
    .replace(/\brolled oats\b|\bporridge oats\b|\boatmeal\b/g, "oats")
    .replace(/\byogh?urt\b|\bcurd\b/g, "yogurt")
    .replace(/\bblack chickpeas?\b|\bchana\b|\bkadala\b/g, "chickpea")
    .replace(/\bchickpeas\b/g, "chickpea")
    .replace(/\bmatta rice\b|\bred rice\b/g, "rice")
    .replace(/\bkodumpuli\b|\bkodampuli\b/g, "kudampuli")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  return normalized.replace(
    /\b(eggs|bananas|apples|tomatoes|potatoes|onions|beans|nuts|seeds|vegetables|leaves|berries)\b/g,
    (word) =>
      ({
        eggs: "egg",
        bananas: "banana",
        apples: "apple",
        tomatoes: "tomato",
        potatoes: "potato",
        onions: "onion",
        beans: "bean",
        nuts: "nut",
        seeds: "seed",
        vegetables: "vegetable",
        leaves: "leaf",
        berries: "berry",
      })[word],
  )
}

function splitRecipeIngredients(value) {
  return String(value || "")
    .split(/[,;\n]+/)
    .map((ingredient) =>
      ingredient
        .replace(/^[\s•*-]+/, "")
        .replace(/^(?:for\s+[^:]+:\s*)/i, "")
        .replace(/^\d+(?:[./]\d+)?\s*/, "")
        .replace(
          /^(?:(?:cups?|tbsp|tablespoons?|tsp|teaspoons?|g|kg|ml|litres?|liters?|cloves?|pieces?|medium|large|small)\s+)+/i,
          "",
        )
        .trim(),
    )
    .filter(Boolean)
}

function pantryIngredientMatches(recipeIngredient, pantryItems) {
  const recipeNames = String(recipeIngredient || "")
    .replace(/\(([^)]+)\)/g, " | $1 | ")
    .split(/\s+(?:or|\/|\|)\s+/i)
    .map(normalizePantryIngredient)
    .filter(Boolean)
  if (!recipeNames.length) {
    return false
  }

  return pantryItems.some((item) => {
    const pantryName = normalizePantryIngredient(item.ItemName)
    if (!pantryName) {
      return false
    }

    return recipeNames.some((recipeName) => {
      const riceFlourMismatch =
        (recipeName === "rice flour" && pantryName === "rice") ||
        (pantryName === "rice flour" && recipeName === "rice")
      const coconutMilkMismatch =
        (recipeName === "coconut milk" && pantryName === "milk") ||
        (pantryName === "coconut milk" && recipeName === "milk")
      return (
        !riceFlourMismatch &&
        !coconutMilkMismatch &&
        (recipeName === pantryName ||
          ` ${recipeName} `.includes(` ${pantryName} `))
      )
    })
  })
}

function getClosePantryIngredientMatches(recipeIngredients, pantryItems) {
  const closeMatches = []
  const maxDistance = (left, right) => {
    const previousRow = Array.from(
      { length: right.length + 1 },
      (_, index) => index,
    )

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const currentRow = [leftIndex]
      for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
        currentRow[rightIndex] = Math.min(
          currentRow[rightIndex - 1] + 1,
          previousRow[rightIndex] + 1,
          previousRow[rightIndex - 1] +
            (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
        )
      }
      previousRow.splice(0, previousRow.length, ...currentRow)
    }

    return previousRow[right.length]
  }

  recipeIngredients.forEach((ingredient) => {
    const normalizedIngredients = String(ingredient)
      .replace(/\(([^)]+)\)/g, " | $1 | ")
      .split(/\s+(?:or|\/|\|)\s+/i)
      .map(normalizePantryIngredient)
      .filter((name) => name.length >= 6)

    pantryItems.forEach((item) => {
      const pantryName = normalizePantryIngredient(item.ItemName)
      const closeName = normalizedIngredients.find(
        (name) => pantryName.length >= 6 && maxDistance(name, pantryName) === 1,
      )
      if (
        closeName &&
        !closeMatches.some(
          (match) => match.ingredient === ingredient && match.pantryName === item.ItemName,
        )
      ) {
        closeMatches.push({
          ingredient,
          pantryName: item.ItemName,
        })
      }
    })
  })

  return closeMatches
}

function getLocalDate() {
  const date = new Date()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getMondayDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  const offset = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - offset)

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function getPlannerDate(weekStart, dayName) {
  const [year, month, day] = weekStart.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(
    date.getDate() + plannerDays.indexOf(dayName),
  )

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function getToken() {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "null",
    )
    return user?.access_token ||
      localStorage.getItem("token") ||
      ""
  } catch {
    return localStorage.getItem("token") || ""
  }
}

function getCurrentUserId() {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "null",
    )
    return Number(user?.UserID) || null
  } catch {
    return null
  }
}

function getHydrationTargetKey() {
  return `dietHydrationTarget:${getCurrentUserId() || "guest"}`
}

function getWellnessHabitsKey() {
  return `dietWellnessHabits:${getCurrentUserId() || "guest"}`
}

function getStoredWellnessHabits() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(getWellnessHabitsKey()) || "{}",
    )
    return stored && typeof stored === "object" ? stored : {}
  } catch {
    return {}
  }
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function getRecipeVisual(recipe) {
  if (recipe.ImageData) {
    return {
      image: recipe.ImageData,
      label: `${recipe.Name} photo`,
    }
  }

  if (recipe.UserID) {
    return { label: "Add your own recipe photo if you like" }
  }

  const name = (recipe.Name || "").toLowerCase()
  const details = `${name} ${recipe.Ingredients || ""}`.toLowerCase()
  const keralaPhotos = [
    {
      match: /kozhukatta|kozukkata|kozhukattai/,
      image: keralaKozhukattaImage,
      label: "Kozhukatta",
    },
    {
      match: /unniyappam|unni appam/,
      image: keralaUnniyappamImage,
      label: "Unniyappam",
    },
    {
      match: /pazham pori/,
      image: keralaPazhamPoriImage,
      label: "Pazham pori",
      credit: "Photo: Vis M · CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Pazham_pori_04.jpg",
    },
    {
      match: /parippu vada|parippuvada/,
      image: keralaParippuVadaImage,
      label: "Parippu vada",
      credit: "Photo: Daniel Zemans · CC BY 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Parippu_Vada_aka_Paruppu_Vadai_-_Vada_made_with_Lentil.jpg",
    },
    {
      match: /samosa/,
      image: keralaSamosaImage,
      label: "Samosa and chai",
      credit: "Photo: Sarkar Sayantan · CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Indian_evening_snack_-_samosa_and_dalmoth_with_cutting_chai.jpg",
    },
    {
      match: /idiyappam.*vegetable stew|vegetable stew.*idiyappam/,
      image: keralaIdiyappamImage,
      label: "Idiyappam and vegetable stew",
      imagePosition: "center 35%",
    },
    {
      match: /puttu.*kadala|kadala.*puttu/,
      image: keralaPuttuImage,
      label: "Puttu and kadala curry",
    },
    {
      match: /appam.*(stew|ishtu)|(stew|ishtu).*appam/,
      image: keralaAppamImage,
      label: "Appam and stew",
      imagePosition: "center 35%",
    },
    {
      match: /fish curry|meen curry/,
      image: keralaFishCurryImage,
      label: "Kerala fish curry",
      credit: "Photo: stu_spivack · CC BY-SA 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Kerala_fish_curry_(2303829166).jpg",
    },
    {
      match: /kerala matta rice, avial and thoran/,
      image: keralaSadyaImage,
      label: "Kerala sadya meal",
      credit: "Photo: George Augustine · CC BY 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Onam_vannae_-_Flickr_-_George_Augustine.jpg",
    },
    {
      match: /avial|aviyal/,
      image: keralaAviyalImage,
      label: "Aviyal",
      credit: "Photo: Samphotography · CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Aviyal,Kerala_cuisine.jpg",
    },
  ]
  const keralaVisual = keralaPhotos.find((visual) => visual.match.test(name))

  if (keralaVisual) {
    return keralaVisual
  }

  if (
    /\b(kerala|pazham pori|parippu vada|parippuvada|unniyappam|kozhukatta|puttu|idiyappam|appam|palappam|avial|aviyal|thoran|matta rice|meen curry|moru curry|kanji|cherupayar|sambar|dosa|idli)\b/.test(
      name,
    )
  ) {
    return { label: "Dish photo not available yet" }
  }

  const visuals = [
    { match: /banana/, image: bananaOatSkilletImage, label: "Banana & oats" },
    { match: /yogurt|yoghurt|berries|fruit bowl/, image: fruitYogurtBowlImage, label: "Fruit & yogurt" },
    { match: /paneer/, image: paneerVegetableWrapImage, label: "Paneer wrap" },
    { match: /soup/, image: vegetableSoupImage, label: "Vegetable soup" },
    { match: /rice/, image: vegetableRiceBowlImage, label: "Rice bowl" },
    { match: /chickpea|chana/, image: chickpeaVegetableSaladImage, label: "Chickpea salad" },
    { match: /omelette|omelet|egg/, image: vegetableOmeletteImage, label: "Vegetable omelette" },
    { match: /oat/, image: vegetableOatsBowlImage, label: "Savoury oats" },
    { match: /salad/, image: chickpeaVegetableSaladImage, label: "Fresh salad" },
    { match: /wrap|roll/, image: paneerVegetableWrapImage, label: "Fresh wrap" },
    { match: /pasta|noodle/, label: "Pasta bowl" },
    { match: /smoothie|shake/, label: "Fresh smoothie" },
  ]

  return visuals.find((visual) => visual.match.test(name))
    || visuals.find((visual) => visual.match.test(details))
    || {
    label: recipe.MealType ? `${recipe.MealType} idea` : "A nourishing dish",
  }
}

function MealCard({ meal, index, onOpenIdea }) {
  return (
    <article className="rounded-3xl border border-outline-variant/70 bg-white p-6 soft-shadow transition-transform duration-200 hover:-translate-y-1">
      <div className="mb-5 flex items-center justify-between">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-secondary">
          <span className="material-symbols-outlined text-[25px]">{meal.icon}</span>
        </span>
        <span className="text-sm font-medium text-on-surface-variant">{meal.time}</span>
      </div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-tertiary">
        Meal {index + 1}
      </p>
      <h3 className="mb-2 font-['Playfair_Display'] text-2xl font-semibold text-plum-deep">
        {meal.title}
      </h3>
      <p className="mb-5 text-sm leading-6 text-on-surface-variant">{meal.summary}</p>
      <ul className="space-y-3">
        {meal.ideas.map((idea) => {
          const ideaTitle = String(idea.title || "").trim().toLowerCase()
          const breakfastVisuals = {
            "oats with fruit and seeds": {
              image: breakfastOatsFruitSeedsImage,
              label: "Oats with fruit and seeds",
            },
            "eggs or tofu with vegetables": {
              image: breakfastEggTofuVegetablesImage,
              label: "Eggs or tofu with vegetables",
            },
            "dosa with sambar": {
              image: breakfastDosaSambarImage,
              label: "Dosa with sambar",
            },
            "idli with sambar": {
              image: breakfastIdliSambarImage,
              label: "Idli with sambar",
            },
            "appam with kadala curry": {
              image: breakfastAppamKadalaImage,
              label: "Appam with kadala curry",
            },
            "kanji with payar": {
              image: breakfastKanjiPayarImage,
              label: "Kanji with payar",
            },
          }
          const snackVisuals = {
            unniyappam: {
              image: keralaUnniyappamImage,
              label: "Unniyappam",
            },
            "steamed kozhukatta": {
              image: keralaKozhukattaImage,
              label: "Kozhukatta",
            },
            "roasted banana and nuts": {
              image: snackRoastedBananaNutsImage,
              label: "Roasted banana and nuts",
            },
            "pazham pori": {
              image: snackPazhamPoriImage,
              label: "Pazham pori",
            },
            "parippu vada": {
              image: snackParippuVadaImage,
              label: "Parippu vada",
            },
            "kerala-style samosa": {
              image: snackSamosaImage,
              label: "Kerala-style samosa",
            },
          }
          const snackText = `${ideaTitle} ${idea.foodIdea || ""}`.toLowerCase()
          const snackVisual =
            snackVisuals[ideaTitle] ||
            (/\bunniyappam\b/.test(snackText)
              ? snackVisuals.unniyappam
              : /\b(kozhukatta|kozukkata|kozhukattai)\b/.test(snackText)
                ? snackVisuals["steamed kozhukatta"]
                : /\bpazham pori\b/.test(snackText)
                  ? snackVisuals["pazham pori"]
                  : /\bparippu vada\b/.test(snackText)
                    ? snackVisuals["parippu vada"]
                    : /\bsamosa\b/.test(snackText)
                      ? snackVisuals["kerala-style samosa"]
                      : /\broasted banana\b/.test(snackText) &&
                          /\b(nuts?|peanuts?)\b/.test(snackText)
                        ? snackVisuals["roasted banana and nuts"]
                        : null)
          const visual =
            meal.title.toLowerCase() === "breakfast" &&
            breakfastVisuals[ideaTitle]
              ? breakfastVisuals[ideaTitle]
              : meal.title.toLowerCase() === "snack"
                ? snackVisual || {}
              : meal.title.toLowerCase() === "lunch"
                ? {}
                : meal.title.toLowerCase() === "dinner"
                  ? {}
                : getRecipeVisual({
                  Name: idea.foodIdea || idea.title,
                  Ingredients: idea.summary || "",
                  })

          return (
            <li
              key={`${idea.title}-${idea.foodIdea}`}
              className="flex gap-3 text-sm leading-6 text-on-surface"
            >
              <span className="material-symbols-outlined mt-0.5 text-[18px] text-tertiary">
                check_circle
              </span>

              <button
                type="button"
                onClick={() => onOpenIdea(meal, idea)}
                className="flex min-w-0 flex-1 items-start gap-3 rounded-xl text-left hover:text-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                aria-label={`Open details for ${idea.foodIdea}`}
              >
                {visual.image && (
                  <img
                    src={visual.image}
                    alt={visual.label}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    style={{ objectPosition: visual.imagePosition || "center" }}
                  />
                )}
                <span className="min-w-0">
                  <strong className="block font-semibold">{idea.title}</strong>
                  {idea.foodIdea && (
                    <span className="block">{idea.foodIdea}</span>
                  )}
                  {idea.summary && (
                    <span className="mt-1 block text-xs leading-5 text-on-surface-variant">
                      {idea.summary}
                    </span>
                  )}
                  <span className="mt-1 inline-block text-xs font-semibold text-tertiary">
                    View recipe or idea details
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

function RecipeCard({
  recipe,
  isFavorite,
  isPersonal,
  onToggleFavorite,
  onAddToPlanner,
  onAddIngredients,
  onOpen,
  onDelete,
}) {
  const visual = getRecipeVisual(recipe)

  return (
    <article className="rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm">
      <div
        role="group"
        aria-label={`Food photo for ${recipe.Name}`}
        className="relative mb-5 flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container/70 via-white to-secondary-container"
      >
        {visual.image && (
          <img
            src={visual.image}
            alt={visual.label}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: visual.imagePosition || "center" }}
          />
        )}
        <span className="absolute bottom-3 left-3 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[10px] font-semibold tracking-wide text-on-surface-variant backdrop-blur-sm">
          {visual.label}
        </span>
        {visual.credit && visual.source && (
          <a
            href={visual.source}
            target="_blank"
            rel="noreferrer"
            aria-label={`${visual.credit}; view photo license`}
            className="absolute bottom-3 right-3 max-w-[70%] truncate rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[9px] font-medium text-on-surface-variant backdrop-blur-sm hover:bg-white"
          >
            {visual.credit}
          </a>
        )}
        {!visual.image && (
          <div className="flex flex-col items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl" aria-hidden="true">
              restaurant
            </span>
            <span className="text-xs font-medium">{visual.label}</span>
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f3efdf] px-3 py-1 text-xs font-semibold text-[#535845]">
            {recipe.MealType}
          </span>
          <span className="rounded-full bg-[#faf7f0] px-3 py-1 text-xs font-semibold text-[#77776d]">
            {isPersonal ? "My recipe" : "Shared recipe"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {recipe.CookingTime && (
            <span className="flex items-center gap-1 text-xs text-[#77776d]">
              <span className="material-symbols-outlined text-[17px]">
                schedule
              </span>
              {recipe.CookingTime}
            </span>
          )}

          <button
            type="button"
            onClick={() => onToggleFavorite(recipe)}
            aria-label={
              isFavorite
                ? `Remove ${recipe.Name} from favorites`
                : `Add ${recipe.Name} to favorites`
            }
            className="rounded-full p-2 text-[#b38b45] hover:bg-[#f3efdf]"
          >
            <span className="material-symbols-outlined">
              {isFavorite ? "star" : "star_border"}
            </span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(recipe)}
        className="mb-3 text-left"
      >
        <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#3f3d35] hover:text-[#535845]">
          {recipe.Name}
        </h3>
      </button>

      {recipe.Notes && (
        <p className="mb-4 text-sm leading-6 text-[#626258]">
          {recipe.Notes}
        </p>
      )}

      <div className="mb-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#77776d]">
          Ingredients
        </p>

        <p className="text-sm leading-6 text-[#4f5148]">
          {recipe.Ingredients}
        </p>
      </div>

      <div className="mb-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#77776d]">
          Instructions
        </p>

        <p className="text-sm leading-6 text-[#4f5148]">
          {recipe.Instructions}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onAddToPlanner(recipe.RecipeID)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#535845] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#444937]"
        >
          <span className="material-symbols-outlined text-[18px]">
            event
          </span>
          Add to planner
        </button>

        <button
          type="button"
          onClick={() => onAddIngredients(recipe)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#535845] px-4 py-2.5 text-sm font-semibold text-[#535845] hover:bg-[#f3efdf]"
        >
          <span className="material-symbols-outlined text-[18px]">
            shopping_cart
          </span>
          Shopping list
        </button>

        {isPersonal && (
          <button
            type="button"
            onClick={() => onDelete(recipe)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#d9a18f] px-4 py-2.5 text-sm font-semibold text-[#9b4937] hover:bg-[#fff4ef]"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
            Delete recipe
          </button>
        )}
      </div>
    </article>
  )
}

export default function Diet() {
  const [selectedDate, setSelectedDate] = useState(getLocalDate)

  // ---------------------------------------------------------
  // MEAL SUGGESTIONS
  // ---------------------------------------------------------

  const [meals, setMeals] = useState([])
  const [mealsLoading, setMealsLoading] = useState(true)
  const [mealsError, setMealsError] = useState("")
  const [mealSearch, setMealSearch] = useState("")

  // ---------------------------------------------------------
  // RECIPES
  // ---------------------------------------------------------

  const [recipes, setRecipes] = useState([])
  const [recipesLoading, setRecipesLoading] = useState(true)
  const [recipesError, setRecipesError] = useState("")

  const [favoriteRecipes, setFavoriteRecipes] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)

  const [recipeSearch, setRecipeSearch] = useState("")
  const [recipeMealType, setRecipeMealType] = useState("All")
  const [recipeSpecialFilter, setRecipeSpecialFilter] = useState("All")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [recipeAssistantPrompt, setRecipeAssistantPrompt] = useState("")
  const [recipeAssistantResult, setRecipeAssistantResult] = useState(null)
  const [recipeAssistantLoading, setRecipeAssistantLoading] = useState(false)
  const [recipeAssistantError, setRecipeAssistantError] = useState("")

  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [recipeDetailsError, setRecipeDetailsError] = useState("")
  const [currentUserId] = useState(getCurrentUserId)

  // ---------------------------------------------------------
  // DAILY DIET LOG
  // ---------------------------------------------------------

  const [dietLog, setDietLog] = useState([])

  const [mealType, setMealType] = useState("Breakfast")
  const [food, setFood] = useState("")
  const [portion, setPortion] = useState("")
  const [notes, setNotes] = useState("")
  const [editingDietEntry, setEditingDietEntry] = useState(null)

  const [dietLogLoading, setDietLogLoading] = useState(false)
  const [dietLogError, setDietLogError] = useState("")

  // ---------------------------------------------------------
  // RECIPE FORM
  // ---------------------------------------------------------

  const emptyRecipe = {
    Name: "",
    MealType: "Breakfast",
    Ingredients: "",
    Instructions: "",
    CookingTime: "",
    Notes: "",
    ImageData: "",
    IsFavorite: 0,
    IsPublic: 0,
  }

  const [newRecipe, setNewRecipe] = useState(emptyRecipe)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [recipeFormOpen, setRecipeFormOpen] = useState(false)
  const [recipeFormError, setRecipeFormError] = useState("")
  const [recipeFormSaving, setRecipeFormSaving] = useState(false)

  // ---------------------------------------------------------
  // PLANNER
  // ---------------------------------------------------------

  const [planner, setPlanner] = useState([])
  const [plannerDay, setPlannerDay] = useState("Monday")
  const [plannerWeekStart, setPlannerWeekStart] =
    useState(() => getMondayDate(getLocalDate()))
  const [plannerMealType, setPlannerMealType] =
    useState("Breakfast")
  const [selectedPlannerRecipe, setSelectedPlannerRecipe] =
    useState("")
  const [plannerRecipeSearch, setPlannerRecipeSearch] = useState("")
  const [plannerLoading, setPlannerLoading] = useState(false)
  const [plannerError, setPlannerError] = useState("")

  // ---------------------------------------------------------
  // PANTRY
  // ---------------------------------------------------------

  const [pantry, setPantry] = useState([])
  const [pantryInput, setPantryInput] = useState("")
  const [pantryLoading, setPantryLoading] = useState(false)
  const [pantryError, setPantryError] = useState("")

  // ---------------------------------------------------------
  // SHOPPING LIST
  // ---------------------------------------------------------

  const [shoppingList, setShoppingList] = useState([])
  const [shoppingInput, setShoppingInput] = useState("")

  const [shoppingLoading, setShoppingLoading] =
    useState(false)
  const [shoppingError, setShoppingError] = useState("")

  // ---------------------------------------------------------
  // WELLNESS HABITS
  // ---------------------------------------------------------

  const [wellnessHabits, setWellnessHabits] = useState(
    getStoredWellnessHabits,
  )
  const [wellnessHabitsError, setWellnessHabitsError] = useState("")

  // ---------------------------------------------------------
  // HYDRATION
  // ---------------------------------------------------------

  const [hydration, setHydration] = useState(0)
  const [hydrationTarget, setHydrationTarget] = useState(() => {
    const stored = Number(localStorage.getItem(getHydrationTargetKey()))
    return Number.isFinite(stored) && stored > 0 ? stored : 8
  })
  const [hydrationLoading, setHydrationLoading] =
    useState(false)
  const [hydrationError, setHydrationError] = useState("")

  // ---------------------------------------------------------
  // LOAD MEAL SUGGESTIONS
  // ---------------------------------------------------------

  useEffect(() => {
    async function loadMeals() {
      try {
        setMealsLoading(true)
        setMealsError("")

        const response = await fetch(
          `${API_BASE_URL}/diet/suggestions`,
          {
            headers: authHeaders(),
          },
        )

        if (!response.ok) {
          throw new Error(
            "Failed to load diet suggestions",
          )
        }

        const data = await response.json()

        const seenSummaries = new Set()
        const grouped = data.reduce((groups, item) => {
          const type = item.MealType

          if (!groups[type]) {
            groups[type] = {
              id: type.toLowerCase(),
              time:
                type === "Breakfast"
                  ? "Start your day"
                  : type === "Lunch"
                    ? "Midday"
                    : type === "Dinner"
                      ? "Evening"
                      : "Anytime",
              title: type,
              icon:
                type === "Breakfast"
                  ? "wb_twilight"
                  : type === "Lunch"
                    ? "light_mode"
                    : type === "Dinner"
                      ? "bedtime"
                      : "nutrition",
              summary:
                type === "Breakfast"
                  ? "A mix of familiar and traditional ways to start the day."
                  : type === "Lunch"
                    ? "Build a satisfying plate with grains, vegetables, and protein foods."
                    : type === "Dinner"
                      ? "Flexible evening meal ideas to suit your appetite."
                      : "Small meal and tea-time ideas to enjoy when you are hungry.",
              ideas: [],
            }
          }

          if (item.FoodIdea) {
            const foodIdea = String(item.FoodIdea).trim()
            const normalizedFoodIdea = foodIdea.toLowerCase()
            const storedTitle = String(item.Title || "").trim()
            const hasSpecificTitle =
              storedTitle &&
              storedTitle.toLowerCase() !== type.toLowerCase()
            const isDuplicate = groups[type].ideas.some(
              (idea) =>
                idea.foodIdea.trim().toLowerCase() === normalizedFoodIdea ||
                (hasSpecificTitle &&
                  idea.title.toLowerCase() === storedTitle.toLowerCase()),
            )

            if (!isDuplicate) {
              const summary = String(item.Summary || "").trim()
              const normalizedSummary = `${type}:${summary.toLowerCase()}`
              const displaySummary =
                summary && !seenSummaries.has(normalizedSummary)

              if (summary) {
                seenSummaries.add(normalizedSummary)
              }

              const normalizedIdeaTitle =
                /\boats?\b/.test(normalizedFoodIdea) &&
                /\b(fruit|fruits|seed|seeds|berry|berries)\b/.test(
                  normalizedFoodIdea,
                )
                  ? "Oats with fruit and seeds"
                  : /\b(egg|eggs|tofu)\b/.test(normalizedFoodIdea) &&
                      /\b(vegetable|vegetables|veggies)\b/.test(
                        normalizedFoodIdea,
                      )
                    ? "Eggs or tofu with vegetables"
                    : foodIdea

              groups[type].ideas.push({
                title: hasSpecificTitle ? storedTitle : normalizedIdeaTitle,
                foodIdea:
                  hasSpecificTitle || normalizedIdeaTitle !== foodIdea
                    ? foodIdea
                    : "",
                summary: displaySummary ? summary : "",
              })
            }
          }

          return groups
        }, {})

        setMeals(Object.values(grouped))
      } catch (error) {
        setMealsError(error.message)
      } finally {
        setMealsLoading(false)
      }
    }

    loadMeals()
  }, [])

  const filteredMeals = useMemo(() => {
    const search = mealSearch.trim().toLowerCase()
    if (!search) {
      return meals
    }

    return meals
      .map((meal) => {
        const matchesMealType = meal.title.toLowerCase().includes(search)
        return {
          ...meal,
          ideas: matchesMealType
            ? meal.ideas
            : meal.ideas.filter((idea) =>
                `${idea.title} ${idea.foodIdea} ${idea.summary}`
                  .toLowerCase()
                  .includes(search),
              ),
        }
      })
      .filter(
        (meal) =>
          meal.title.toLowerCase().includes(search) ||
          meal.ideas.length > 0,
      )
  }, [meals, mealSearch])

  // ---------------------------------------------------------
  // LOAD RECIPES
  // ---------------------------------------------------------

  async function loadRecipes() {
    try {
      setRecipesLoading(true)
      setRecipesError("")

      const response = await fetch(
        `${API_BASE_URL}/recipes`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load recipes")
      }

      const data = await response.json()

      setRecipes(data)
    } catch (error) {
      setRecipesError(error.message)
    } finally {
      setRecipesLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD FAVORITES
  // ---------------------------------------------------------

  async function loadFavorites() {
    try {
      setFavoritesLoading(true)

      const response = await fetch(
        `${API_BASE_URL}/recipes/favorites`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load favorites")
      }

      const data = await response.json()

      setFavoriteRecipes(
        Array.isArray(data) ? data : [],
      )
    } catch (error) {
      console.error(error)
    } finally {
      setFavoritesLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD DIET LOG
  // ---------------------------------------------------------

  async function loadDietLog() {
    try {
      setDietLogLoading(true)
      setDietLogError("")

      const response = await fetch(
        `${API_BASE_URL}/diet/logs`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load diet log")
      }

      const data = await response.json()

      setDietLog(data)
    } catch (error) {
      setDietLogError(error.message)
    } finally {
      setDietLogLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD PLANNER
  // ---------------------------------------------------------

  async function loadPlanner() {
    try {
      setPlannerLoading(true)
      setPlannerError("")

      const response = await fetch(
        `${API_BASE_URL}/meal-planner`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load meal planner")
      }

      const data = await response.json()

      setPlanner(data)
    } catch (error) {
      setPlannerError(error.message)
    } finally {
      setPlannerLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD PANTRY
  // ---------------------------------------------------------

  async function loadPantry() {
    try {
      setPantryLoading(true)
      setPantryError("")

      const response = await fetch(
        `${API_BASE_URL}/pantry`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load pantry")
      }

      const data = await response.json()

      setPantry(data)
    } catch (error) {
      setPantryError(error.message)
    } finally {
      setPantryLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD SHOPPING LIST
  // ---------------------------------------------------------

  async function loadShoppingList() {
    try {
      setShoppingLoading(true)
      setShoppingError("")

      const response = await fetch(
        `${API_BASE_URL}/shopping-list`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to load shopping list",
        )
      }

      const data = await response.json()

      setShoppingList(data)
    } catch (error) {
      setShoppingError(error.message)
    } finally {
      setShoppingLoading(false)
    }
  }

  // ---------------------------------------------------------
  // LOAD HYDRATION
  // ---------------------------------------------------------

  const loadHydration = useCallback(async (date) => {
    try {
      setHydrationLoading(true)
      setHydrationError("")

      const response = await fetch(
        `${API_BASE_URL}/hydration?log_date=${date}`,
        {
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to load hydration",
        )
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        const current = data.find(
          (item) => item.LogDate === date,
        )

        setHydration(current?.Glasses || 0)
      } else {
        setHydration(data?.Glasses || 0)
      }
    } catch (error) {
      setHydrationError(error.message)
    } finally {
      setHydrationLoading(false)
    }
  }, [])

  // ---------------------------------------------------------
  // INITIAL LOAD
  // ---------------------------------------------------------

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.resolve()
      loadRecipes()
      loadFavorites()
      loadDietLog()
      loadPlanner()
      loadPantry()
      loadShoppingList()
    }

    void loadInitialData()
  }, [])

  useEffect(() => {
    const loadSelectedHydration = async () => {
      await Promise.resolve()
      loadHydration(selectedDate)
    }

    void loadSelectedHydration()
  }, [loadHydration, selectedDate])

  // ---------------------------------------------------------
  // DAILY LOG
  // ---------------------------------------------------------

  const todaysEntries = useMemo(
    () =>
      dietLog
        .filter(
          (entry) =>
            String(entry.LogDate) === selectedDate,
        )
        .sort(
          (a, b) =>
            new Date(b.CreatedAt || 0) -
            new Date(a.CreatedAt || 0),
        ),
    [dietLog, selectedDate],
  )

  const entriesByMeal = useMemo(() => {
    return trackedMealTypes.reduce(
      (result, type) => {
        result[type] = todaysEntries.filter(
          (entry) =>
            entry.MealType === type,
        )

        return result
      },
      {},
    )
  }, [todaysEntries])

  const mainMealsLogged = trackedMealTypes
    .filter((type) => type !== "Snack")
    .filter(
      (type) =>
        entriesByMeal[type].length > 0,
    ).length

  const dailyHabits = [
    { id: "nourishing-meal", label: "Enjoyed a meal that felt nourishing", icon: "restaurant" },
    { id: "movement-break", label: "Made time for a movement or stretch break", icon: "directions_walk" },
    { id: "rest-break", label: "Took a moment to pause and recharge", icon: "self_improvement" },
  ]
  const checkedDailyHabits = wellnessHabits[selectedDate] || {}
  const completedHabitCount = dailyHabits.filter(
    (habit) => checkedDailyHabits[habit.id],
  ).length

  function toggleWellnessHabit(habitId) {
    const nextForDate = {
      ...checkedDailyHabits,
      [habitId]: !checkedDailyHabits[habitId],
    }
    const nextHabits = {
      ...wellnessHabits,
      [selectedDate]: nextForDate,
    }

    setWellnessHabitsError("")
    try {
      localStorage.setItem(
        getWellnessHabitsKey(),
        JSON.stringify(nextHabits),
      )
      setWellnessHabits(nextHabits)
    } catch {
      setWellnessHabitsError(
        "Your check-in could not be saved in this browser. Please check your storage settings and try again.",
      )
    }
  }

  // ---------------------------------------------------------
  // FILTERED RECIPES
  // ---------------------------------------------------------

  const filteredRecipes = useMemo(() => {
    const search = recipeSearch
      .trim()
      .toLowerCase()

    const matches = recipes.filter((recipe) => {
      const name = String(recipe.Name || "")
      const ingredients = String(
        recipe.Ingredients || "",
      )
      const type = String(
        recipe.MealType || "",
      )
      const recipeText = `${name} ${ingredients} ${type} ${
        recipe.Instructions || ""
      }`.toLowerCase()
      const cookingMinutes = Number(
        String(recipe.CookingTime || "").match(/\d+/)?.[0],
      )

      const matchesSearch =
        !search ||
        recipeText.includes(search)

      const matchesMealType =
        recipeMealType === "All" ||
        type === recipeMealType

      const matchesFavorites =
        !showFavoritesOnly ||
        favoriteRecipes.includes(recipe.RecipeID)

      const matchesSpecialFilter =
        recipeSpecialFilter === "All" ||
        (recipeSpecialFilter === "Vegetarian" &&
          !/\b(meat|beef|pork|chicken|turkey|fish|seafood|lamb|bacon|ham)\b/.test(
            recipeText,
          )) ||
        (recipeSpecialFilter === "Quick" &&
          ((Number.isFinite(cookingMinutes) &&
            cookingMinutes <= 20) ||
            /\b(quick|under 20|20 min|15 min|10 min)\b/.test(
              String(recipe.CookingTime || "").toLowerCase(),
            ))) ||
        (recipeSpecialFilter === "No-cook" &&
          /\b(no[- ]cook|no cooking|uncooked)\b/.test(
            recipeText,
          ))

      return (
        matchesSearch &&
        matchesMealType &&
        matchesFavorites &&
        matchesSpecialFilter
      )
    })

    return matches.sort((left, right) => {
      const score = (recipe) => {
        const text = `${recipe.Name || ""} ${
          recipe.Ingredients || ""
        }`.toLowerCase()
        return pantry.reduce(
          (count, item) =>
            count +
            (String(item.ItemName || "").trim() &&
            text.includes(
              String(item.ItemName || "").trim().toLowerCase(),
            )
              ? 1
              : 0),
          0,
        )
      }
      return score(right) - score(left)
    })
  }, [
    recipes,
    recipeSearch,
    recipeMealType,
    recipeSpecialFilter,
    showFavoritesOnly,
    favoriteRecipes,
    pantry,
  ])

  const filteredKeralaRecipes = useMemo(() => {
    const search = recipeSearch.trim().toLowerCase()

    return keralaRecipeDetails.filter((recipe) => {
      const searchable = `${recipe.Name} ${recipe.SearchTerms} ${
        recipe.Ingredients
      } ${recipe.Instructions}`.toLowerCase()
      const minutes = Number(recipe.CookingTime.match(/\d+/)?.[0])
      const isVegetarian =
        !/\b(meat|beef|pork|chicken|turkey|fish|seafood|lamb|bacon|ham)\b/.test(
          searchable,
        )
      const matchesSpecialFilter =
        recipeSpecialFilter === "All" ||
        (recipeSpecialFilter === "Vegetarian" && isVegetarian) ||
        (recipeSpecialFilter === "Quick" && minutes <= 20) ||
        (recipeSpecialFilter === "No-cook" &&
          /\b(no[- ]cook|no cooking|uncooked)\b/.test(searchable))

      return (
        !showFavoritesOnly &&
        (!search || searchable.includes(search)) &&
        (recipeMealType === "All" ||
          recipe.MealType === recipeMealType) &&
        matchesSpecialFilter
      )
    })
  }, [
    recipeSearch,
    recipeMealType,
    recipeSpecialFilter,
    showFavoritesOnly,
  ])

  function openRecipeDetails(recipe) {
    setRecipeDetailsError("")
    setSelectedRecipe(recipe)
    window.setTimeout(() => {
      document
        .getElementById("recipe-details-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 0)
  }

  async function openMealIdea(meal, idea) {
    const normalizeWords = (value) =>
      String(value || "")
        .toLowerCase()
        .match(/[a-z0-9]+/g)
        ?.join(" ") || ""
    const suggestionText = normalizeWords(
      `${idea.title || ""} ${idea.foodIdea || ""}`,
    )
    const includesDishName = (text, dishName) =>
      ` ${normalizeWords(text)} `.includes(
        ` ${normalizeWords(dishName)} `,
      )
    const localRecipe = [
      ...keralaRecipeDetails,
      ...mealSuggestionRecipeDetails,
    ]
      .flatMap((recipe) =>
        recipe.SearchTerms.split("|")
          .filter((alias) => includesDishName(suggestionText, alias))
          .map((alias) => ({
            recipe,
            aliasLength: normalizeWords(alias).length,
          })),
      )
      .sort((left, right) => right.aliasLength - left.aliasLength)[0]
      ?.recipe

    if (localRecipe) {
      openRecipeDetails(localRecipe)
      return
    }

    const savedRecipe = recipes.find((recipe) =>
      includesDishName(suggestionText, recipe.Name),
    )

    if (savedRecipe) {
      openRecipeDetails(savedRecipe)
      return
    }

    try {
      setRecipeDetailsError("")
      const response = await fetch(`${API_BASE_URL}/recipes/assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          prompt: `Give me the complete recipe for "${idea.title}". Meal: ${meal.title}. Food description: ${idea.foodIdea || idea.title}.`,
        }),
      })

      if (!response.ok) {
        throw new Error("Could not load recipe details for this meal.")
      }

      const recipe = await response.json()
      if (!recipe.Name || !recipe.Ingredients || !recipe.Instructions) {
        throw new Error("Recipe details are unavailable for this meal.")
      }

      openRecipeDetails(recipe)
    } catch (error) {
      setSelectedRecipe(null)
      setRecipeDetailsError(error.message)
    }
  }

  // ---------------------------------------------------------
  // PLANNER
  // ---------------------------------------------------------

  const selectedPlannerDate = getPlannerDate(
    plannerWeekStart,
    plannerDay,
  )

  const plannerRecipeOptions = useMemo(() => {
    const uniqueRecipes = new Map()
    ;[...recipes, ...keralaRecipeDetails, ...mealSuggestionRecipeDetails].forEach(
      (recipe) => {
        const nameKey = normalizePantryIngredient(recipe.Name)
        if (nameKey && !uniqueRecipes.has(nameKey)) {
          uniqueRecipes.set(nameKey, {
            ...recipe,
            PlannerOptionID: Number.isInteger(Number(recipe.RecipeID))
              ? `recipe-${recipe.RecipeID}`
              : `local-${nameKey}`,
          })
        }
      },
    )
    return [...uniqueRecipes.values()]
  }, [recipes])

  const plannerRecipes = useMemo(() => {
    return planner
      .filter(
        (item) =>
          String(item.PlanDate).slice(0, 10) ===
            selectedPlannerDate &&
          item.MealType === plannerMealType,
      )
      .map((item) => ({
        ...item,
        recipe: recipes.find(
          (recipe) =>
            recipe.RecipeID === item.RecipeID,
        ),
      }))
      .filter((item) => item.recipe)
  }, [planner, selectedPlannerDate, plannerMealType, recipes])

  // ---------------------------------------------------------
  // PANTRY MATCHES
  // ---------------------------------------------------------

  const pantryMatches = useMemo(() => {
    if (!pantry.length) {
      return []
    }

    const uniqueRecipes = new Map()
    ;[...recipes, ...keralaRecipeDetails, ...mealSuggestionRecipeDetails].forEach(
      (recipe) => {
        const key = normalizePantryIngredient(recipe.Name)
        if (key && !uniqueRecipes.has(key)) {
          uniqueRecipes.set(key, recipe)
        }
      },
    )

    const matches = [...uniqueRecipes.values()].map((recipe) => {
      const ingredients = splitRecipeIngredients(recipe.Ingredients)
      const availableIngredients = ingredients.filter((ingredient) =>
        pantryIngredientMatches(ingredient, pantry),
      )
      const missingIngredients = ingredients.filter(
        (ingredient) => !pantryIngredientMatches(ingredient, pantry),
      )
      const closeMatches = getClosePantryIngredientMatches(
        ingredients,
        pantry,
      )

      return {
        recipe,
        ingredients,
        availableIngredients,
        missingIngredients,
        closeMatches,
        matchCount: availableIngredients.length,
        missingCount: missingIngredients.length,
      }
    })
    const matchingRecipes = matches.filter((item) => item.matchCount > 0)
    const suggestions = matchingRecipes.length
      ? matchingRecipes
      : matches.filter((item) => item.closeMatches.length > 0)

    return suggestions
      .sort(
        (a, b) =>
          b.matchCount - a.matchCount ||
          b.closeMatches.length - a.closeMatches.length ||
          a.missingCount - b.missingCount ||
          a.ingredients.length - b.ingredients.length ||
          a.recipe.Name.localeCompare(b.recipe.Name),
      )
      .slice(0, 5)
  }, [recipes, pantry])

  // ---------------------------------------------------------
  // NUTRITION SUMMARY
  // ---------------------------------------------------------

  const weekEntries = useMemo(() => {
    const weekStart = getMondayDate(selectedDate)
    const weekEnd = getPlannerDate(weekStart, "Sunday")
    return dietLog.filter((entry) => {
      const date = String(entry.LogDate).slice(0, 10)
      return date >= weekStart && date <= weekEnd
    })
  }, [dietLog, selectedDate])

  const nutritionSummary = useMemo(() => {
    const categories = {
      vegetables: [
        "vegetable",
        "spinach",
        "carrot",
        "tomato",
        "beans",
        "cabbage",
        "broccoli",
        "salad",
      ],
      fruit: [
        "fruit",
        "banana",
        "apple",
        "orange",
        "berry",
        "berries",
        "mango",
      ],
      protein: [
        "egg",
        "eggs",
        "paneer",
        "tofu",
        "beans",
        "chickpea",
        "chicken",
        "fish",
        "lentil",
        "dal",
        "yogurt",
      ],
      grains: [
        "rice",
        "oats",
        "bread",
        "roti",
        "dosa",
        "idli",
        "wheat",
      ],
    }

    const result = {}

    Object.entries(categories).forEach(
      ([category, words]) => {
        result[category] = weekEntries.filter((entry) => {
          const text = String(entry.Food || "").toLowerCase()
          return words.some((word) => text.includes(word))
        }).length
      },
    )

    return {
      ...result,
      meals: weekEntries.length,
      breakfast: weekEntries.filter(
        (entry) => entry.MealType === "Breakfast",
      ).length,
      lunch: weekEntries.filter(
        (entry) => entry.MealType === "Lunch",
      ).length,
      dinner: weekEntries.filter(
        (entry) => entry.MealType === "Dinner",
      ).length,
      snacks: weekEntries.filter(
        (entry) => entry.MealType === "Snack",
      ).length,
      variety: new Set(
        weekEntries
          .map((entry) =>
            String(entry.Food || "").trim().toLowerCase(),
          )
          .filter(Boolean),
      ).size,
    }
  }, [weekEntries])

  const smartSuggestion = useMemo(() => {
    if (weekEntries.length < 3) {
      const firstIdea = meals[0]?.ideas?.[0]
      const firstIdeaText =
        typeof firstIdea === "string"
          ? firstIdea
          : firstIdea?.foodIdea || firstIdea?.title

      return {
        personalized: false,
        text: firstIdeaText ||
          "Try a simple meal with a grain, vegetables, and a protein food.",
      }
    }

    const riceMeals = weekEntries.filter((entry) =>
      /\brice\b/i.test(String(entry.Food || "")),
    ).length

    if (riceMeals >= 2) {
      return {
        personalized: true,
        text: "Rice appears in several meals you logged. If you want variety, try oats, roti, millet, or a vegetable-based alternative.",
      }
    }

    const quickRecipe = recipes.find((recipe) => {
      const minutes = Number(
        String(recipe.CookingTime || "").match(/\d+/)?.[0],
      )
      return Number.isFinite(minutes) && minutes <= 20
    })

    return {
      personalized: true,
      text: quickRecipe
        ? `A quick idea from your recipes: ${quickRecipe.Name} (${quickRecipe.CookingTime}).`
        : "Try an easy meal idea from your suggestions, and vary ingredients to suit your preferences.",
    }
  }, [weekEntries, meals, recipes])

  const quickRecipe = useMemo(
    () =>
      recipes.find((recipe) => {
        const time = String(recipe.CookingTime || "").toLowerCase()
        const minutes = Number(time.match(/\d+/)?.[0])
        return (
          (Number.isFinite(minutes) && minutes > 0 && minutes <= 20) ||
          /\bquick\b/.test(time)
        )
      }),
    [recipes],
  )

  // ---------------------------------------------------------
  // ADD DIET LOG
  // ---------------------------------------------------------

  async function addFoodEntry(event) {
    event.preventDefault()

    const trimmedFood = food.trim()

    if (!trimmedFood) {
      return
    }

    try {
      setDietLogLoading(true)
      setDietLogError("")

      const response = await fetch(
        editingDietEntry
          ? `${API_BASE_URL}/diet/logs/${editingDietEntry.DietLogID}`
          : `${API_BASE_URL}/diet/logs`,
        {
          method: editingDietEntry ? "PUT" : "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            LogDate: selectedDate,
            MealType: mealType,
            Food: trimmedFood,
            Portion: portion.trim() || null,
            Notes: notes.trim() || null,
          }),
        },
      )

      if (!response.ok) {
        const detail =
          await response.json().catch(() => ({}))

        throw new Error(
          detail.detail ||
            "Failed to save meal",
        )
      }

      const saved = await response.json()

      setDietLog((current) =>
        editingDietEntry
          ? current.map((entry) =>
              entry.DietLogID === saved.DietLogID
                ? saved
                : entry,
            )
          : [...current, saved],
      )

      setFood("")
      setPortion("")
      setNotes("")
      setEditingDietEntry(null)
    } catch (error) {
      setDietLogError(error.message)
    } finally {
      setDietLogLoading(false)
    }
  }

  function startEditingDietEntry(entry) {
    setEditingDietEntry(entry)
    setSelectedDate(String(entry.LogDate).slice(0, 10))
    setMealType(entry.MealType)
    setFood(entry.Food || "")
    setPortion(entry.Portion || "")
    setNotes(entry.Notes || "")
  }

  function resetDietForm() {
    setEditingDietEntry(null)
    setFood("")
    setPortion("")
    setNotes("")
  }

  // ---------------------------------------------------------
  // DELETE DIET LOG
  // ---------------------------------------------------------

  async function deleteFoodEntry(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/diet/logs/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to delete meal entry",
        )
      }

      setDietLog((current) =>
        current.filter(
          (entry) =>
            entry.DietLogID !== id,
        ),
      )
    } catch (error) {
      setDietLogError(error.message)
    }
  }

  // ---------------------------------------------------------
  // FAVORITES
  // ---------------------------------------------------------

  async function toggleFavorite(recipe) {
    const alreadyFavorite =
      favoriteRecipes.includes(
        recipe.RecipeID,
      )

    try {
      const response = await fetch(
        `${API_BASE_URL}/recipes/${recipe.RecipeID}/favorite`,
        {
          method: alreadyFavorite
            ? "DELETE"
            : "POST",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Could not update favorite",
        )
      }

      setFavoriteRecipes((current) =>
        alreadyFavorite
          ? current.filter(
              (id) =>
                id !== recipe.RecipeID,
            )
          : [
              ...new Set([
                ...current,
                recipe.RecipeID,
              ]),
            ],
      )
    } catch (error) {
      setRecipesError(error.message)
    }
  }

  // ---------------------------------------------------------
  // SAVE / UPDATE RECIPE
  // ---------------------------------------------------------

  async function saveRecipe(event) {
    event.preventDefault()

    setRecipeFormError("")
    setRecipeFormSaving(true)

    try {
      const url = editingRecipe
        ? `${API_BASE_URL}/recipes/${editingRecipe.RecipeID}`
        : `${API_BASE_URL}/recipes`

      const response = await fetch(url, {
        method: editingRecipe
          ? "PUT"
          : "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      })

      if (!response.ok) {
        const detail =
          await response.json().catch(() => ({}))

        throw new Error(
          detail.detail ||
            "Failed to save recipe",
        )
      }

      const savedRecipe =
        await response.json()

      if (editingRecipe) {
        setRecipes((current) =>
          current.map((recipe) =>
            recipe.RecipeID ===
            savedRecipe.RecipeID
              ? savedRecipe
              : recipe,
          ),
        )
      } else {
        setRecipes((current) => [
          savedRecipe,
          ...current,
        ])
        if (recipeAssistantResult) {
          setRecipeAssistantResult(null)
          setRecipeAssistantPrompt("")
        }
      }

      setNewRecipe(emptyRecipe)
      setEditingRecipe(null)
      setRecipeFormOpen(false)

      await loadFavorites()
    } catch (error) {
      setRecipeFormError(error.message)
    } finally {
      setRecipeFormSaving(false)
    }
  }

  async function generateRecipeSuggestion(event) {
    event.preventDefault()
    setRecipeAssistantError("")
    setRecipeAssistantResult(null)

    if (!recipeAssistantPrompt.trim()) {
      setRecipeAssistantError("Describe the ingredients or meal you want.")
      return
    }

    try {
      setRecipeAssistantLoading(true)
      const response = await fetch(
        `${API_BASE_URL}/recipes/assistant`,
        {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: recipeAssistantPrompt.trim(),
          }),
        },
      )

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}))
        throw new Error(
          detail.detail || "Could not prepare a recipe suggestion.",
        )
      }

      setRecipeAssistantResult(await response.json())
    } catch (error) {
      setRecipeAssistantError(error.message)
    } finally {
      setRecipeAssistantLoading(false)
    }
  }

  function saveGeneratedRecipe() {
    if (!recipeAssistantResult) {
      return
    }

    setRecipeAssistantError("")
    setEditingRecipe(null)
    setNewRecipe({
      ...emptyRecipe,
      Name: recipeAssistantResult.Name || "",
      MealType: recipeAssistantResult.MealType || "Breakfast",
      Ingredients: recipeAssistantResult.Ingredients || "",
      Instructions: recipeAssistantResult.Instructions || "",
      CookingTime: recipeAssistantResult.CookingTime || "",
      Notes: recipeAssistantResult.Notes || "",
      ImageData: "",
    })
    setRecipeFormError("")
    setRecipeFormOpen(true)
    document
      .getElementById("recipe-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // ---------------------------------------------------------
  // EDIT RECIPE
  // ---------------------------------------------------------

  function startEditingRecipe(recipe) {
    setEditingRecipe(recipe)

    setNewRecipe({
      Name: recipe.Name || "",
      MealType:
        recipe.MealType || "Breakfast",
      Ingredients:
        recipe.Ingredients || "",
      Instructions:
        recipe.Instructions || "",
      CookingTime:
        recipe.CookingTime || "",
      Notes: recipe.Notes || "",
      ImageData: recipe.ImageData || "",
      IsFavorite: recipe.IsFavorite || 0,
      IsPublic: recipe.IsPublic || 0,
    })

    setRecipeFormError("")
    setRecipeFormOpen(true)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ---------------------------------------------------------
  // DELETE RECIPE
  // ---------------------------------------------------------

  async function deleteRecipe(recipe) {
    if (
      !window.confirm(
        `Delete "${recipe.Name}"?`,
      )
    ) {
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/recipes/${recipe.RecipeID}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to delete recipe",
        )
      }

      setRecipes((current) =>
        current.filter(
          (item) =>
            item.RecipeID !==
            recipe.RecipeID,
        ),
      )

      setFavoriteRecipes((current) =>
        current.filter(
          (id) =>
            id !== recipe.RecipeID,
        ),
      )

      setPlanner((current) =>
        current.filter(
          (item) =>
            item.RecipeID !==
            recipe.RecipeID,
        ),
      )

      if (
        selectedRecipe?.RecipeID ===
        recipe.RecipeID
      ) {
        setSelectedRecipe(null)
      }
    } catch (error) {
      setRecipesError(error.message)
    }
  }

  // ---------------------------------------------------------
  // ADD TO PLANNER
  // ---------------------------------------------------------

  async function addToPlanner(recipeOptionId) {
    try {
      setPlannerError("")
      let recipe = plannerRecipeOptions.find(
        (item) => item.PlannerOptionID === recipeOptionId,
      )

      if (!recipe) {
        throw new Error("Please select a valid recipe.")
      }

      const planDate = getPlannerDate(plannerWeekStart, plannerDay)
      if (
        planner.some(
          (item) =>
            String(item.PlanDate).slice(0, 10) === planDate &&
            item.MealType === plannerMealType,
        )
      ) {
        throw new Error(
          `${plannerMealType} already has a recipe planned for ${planDate}.`,
        )
      }

      if (!Number.isInteger(Number(recipe.RecipeID))) {
        const recipeResponse = await fetch(`${API_BASE_URL}/recipes`, {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: recipe.Name,
            MealType: recipe.MealType,
            Ingredients: recipe.Ingredients,
            Instructions: recipe.Instructions,
            CookingTime: recipe.CookingTime || "",
            Notes: recipe.Notes || "",
          }),
        })

        if (!recipeResponse.ok) {
          const detail = await recipeResponse.json().catch(() => ({}))
          throw new Error(
            detail.detail || `Could not add ${recipe.Name} to your recipes.`,
          )
        }

        recipe = await recipeResponse.json()
        setRecipes((current) => [...current, recipe])
      }

      const response = await fetch(
        `${API_BASE_URL}/meal-planner`,
        {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PlanDate: planDate,
            MealType: plannerMealType,
            RecipeID: recipe.RecipeID,
          }),
        },
      )

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}))
        throw new Error(
          detail.detail || "Failed to add recipe to planner.",
        )
      }

      const created = await response.json()
      setPlanner((current) => [...current, created])
      setSelectedPlannerRecipe("")
    } catch (error) {
      setPlannerError(error.message)
    }
  }

  async function generateWeeklyPlan() {
    const meals = ["Breakfast", "Lunch", "Dinner"]
    const available = Object.fromEntries(
      meals.map((type) => [
        type,
        recipes.filter((recipe) => recipe.MealType === type),
      ]),
    )
    const missingTypes = meals.filter((type) => !available[type].length)

    if (missingTypes.length) {
      setPlannerError(
        `Add recipes for ${missingTypes.join(", ")} before generating a full weekly plan.`,
      )
      return
    }

    try {
      setPlannerError("")
      setPlannerLoading(true)
      const used = new Set(
        planner
          .filter((item) => {
            const date = String(item.PlanDate).slice(0, 10)
            return date >= plannerWeekStart &&
              date <= getPlannerDate(plannerWeekStart, "Sunday")
          })
          .map((item) => item.RecipeID),
      )
      const existingSlots = new Set(
        planner.map(
          (item) =>
            `${String(item.PlanDate).slice(0, 10)}:${item.MealType}`,
        ),
      )

      for (const day of plannerDays) {
        const planDate = getPlannerDate(plannerWeekStart, day)
        for (const type of meals) {
          const slot = `${planDate}:${type}`
          if (existingSlots.has(slot)) {
            continue
          }

          const choices = available[type]
          const recipe =
            choices.find((candidate) => !used.has(candidate.RecipeID)) ||
            choices[
              [...used].filter((id) =>
                choices.some((candidate) => candidate.RecipeID === id),
              ).length % choices.length
            ]
          const response = await fetch(
            `${API_BASE_URL}/meal-planner`,
            {
              method: "POST",
              headers: {
                ...authHeaders(),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                PlanDate: planDate,
                MealType: type,
                RecipeID: recipe.RecipeID,
              }),
            },
          )

          if (!response.ok) {
            const detail = await response.json().catch(() => ({}))
            throw new Error(
              detail.detail ||
                `Could not save the ${type.toLowerCase()} plan for ${planDate}.`,
            )
          }

          const saved = await response.json()
          setPlanner((current) => [...current, saved])
          existingSlots.add(slot)
          used.add(recipe.RecipeID)
        }
      }
    } catch (error) {
      setPlannerError(error.message)
    } finally {
      setPlannerLoading(false)
    }
  }

  async function generateShoppingListFromPlan() {
    const weekEnd = getPlannerDate(plannerWeekStart, "Sunday")
    const weekPlans = planner.filter((item) => {
      const date = String(item.PlanDate).slice(0, 10)
      return date >= plannerWeekStart && date <= weekEnd
    })
    const plannedRecipes = weekPlans
      .map((item) =>
        recipes.find((recipe) => recipe.RecipeID === item.RecipeID),
      )
      .filter(Boolean)
    if (!plannedRecipes.length) {
      setShoppingError("Add recipes to this week's plan first.")
      return
    }

    const pantryNames = pantry
      .map((item) => item.ItemName.trim().toLowerCase())
      .filter(Boolean)
    const existingNames = new Set(
      shoppingList.map((item) => item.ItemName.trim().toLowerCase()),
    )
    const ingredients = new Map()
    plannedRecipes.forEach((recipe) => {
      String(recipe.Ingredients || "")
        .split(/[,;\n]/)
        .map((item) => item.replace(/^[\s•*-]+/, "").trim())
        .filter(Boolean)
        .forEach((ingredient) => {
          const normalized = ingredient.toLowerCase()
          if (
            !pantryNames.some(
              (name) =>
                normalized.includes(name) ||
                name.includes(normalized),
            ) &&
            ![...existingNames].some(
              (name) =>
                normalized.includes(name) ||
                name.includes(normalized),
            ) &&
            !ingredients.has(normalized)
          ) {
            ingredients.set(normalized, ingredient)
          }
        })
    })

    try {
      setShoppingError("")
      setShoppingLoading(true)
      for (const ingredient of ingredients.values()) {
        const response = await fetch(
          `${API_BASE_URL}/shopping-list`,
          {
            method: "POST",
            headers: {
              ...authHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ItemName: ingredient,
              IsChecked: 0,
            }),
          },
        )
        if (!response.ok) {
          const detail = await response.json().catch(() => ({}))
          throw new Error(
            detail.detail ||
              `Could not add ${ingredient} to the shopping list.`,
          )
        }
        const created = await response.json()
        existingNames.add(ingredient.toLowerCase())
        setShoppingList((current) => [...current, created])
      }
    } catch (error) {
      setShoppingError(error.message)
    } finally {
      setShoppingLoading(false)
    }
  }
  // ---------------------------------------------------------
  // DELETE PLANNER ITEM
  // ---------------------------------------------------------

  async function removeFromPlanner(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/meal-planner/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to remove planner item",
        )
      }

      setPlanner((current) =>
        current.filter(
          (item) =>
            item.PlannerID !== id,
        ),
      )
    } catch (error) {
      setPlannerError(error.message)
    }
  }

  // ---------------------------------------------------------
  // PANTRY
  // ---------------------------------------------------------

  async function addPantryItem(event) {
    event.preventDefault()

    const value = pantryInput.trim()

    if (!value) {
      return
    }

    try {
      setPantryLoading(true)
      setPantryError("")

      const response = await fetch(
        `${API_BASE_URL}/pantry`,
        {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ItemName: value,
          }),
        },
      )

      if (!response.ok) {
        const detail =
          await response.json().catch(() => ({}))

        throw new Error(
          detail.detail ||
            "Failed to add pantry item",
        )
      }

      const created = await response.json()

      setPantry((current) =>
        current.some(
          (item) => item.PantryItemID === created.PantryItemID,
        )
          ? current
          : [...current, created],
      )

      setPantryInput("")
    } catch (error) {
      setPantryError(error.message)
    } finally {
      setPantryLoading(false)
    }
  }

  async function removePantryItem(id) {
    try {
      setPantryLoading(true)
      setPantryError("")
      const response = await fetch(
        `${API_BASE_URL}/pantry/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to remove pantry item",
        )
      }

      setPantry((current) =>
        current.filter(
          (item) =>
            item.PantryItemID !== id,
        ),
      )
    } catch (error) {
      setPantryError(error.message)
    } finally {
      setPantryLoading(false)
    }
  }

  // ---------------------------------------------------------
  // SHOPPING LIST
  // ---------------------------------------------------------

  async function addShoppingItem(event) {
    event.preventDefault()

    const value = shoppingInput.trim()

    if (!value) {
      return
    }

    if (
      shoppingList.some(
        (item) =>
          item.ItemName.trim().toLowerCase() === value.toLowerCase(),
      )
    ) {
      setShoppingInput("")
      return
    }

    try {
      setShoppingError("")

      const response = await fetch(
        `${API_BASE_URL}/shopping-list`,
        {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ItemName: value,
            IsChecked: 0,
          }),
        },
      )

      if (!response.ok) {
        const detail =
          await response.json().catch(() => ({}))

        throw new Error(
          detail.detail ||
            "Failed to add shopping item",
        )
      }

      const created = await response.json()

      setShoppingList((current) => [
        ...current,
        created,
      ])

      setShoppingInput("")
    } catch (error) {
      setShoppingError(error.message)
    }
  }

  async function addRecipeIngredients(recipe) {
    const ingredients = String(
      recipe.Ingredients || "",
    )
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean)

    const existingNames = new Set(
      shoppingList.map((item) =>
        String(item.ItemName || "").trim().toLowerCase(),
      ),
    )

    for (const ingredient of ingredients) {
      const normalized = ingredient.toLowerCase()
      if (existingNames.has(normalized)) {
        continue
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/shopping-list`,
          {
            method: "POST",
            headers: {
              ...authHeaders(),
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ItemName: ingredient,
              IsChecked: 0,
            }),
          },
        )

        if (!response.ok) {
          throw new Error(
            `Failed to add ${ingredient}`,
          )
        }

        const created =
          await response.json()

        existingNames.add(normalized)
        setShoppingList((current) => [
          ...current,
          created,
        ])
      } catch (error) {
        setShoppingError(error.message)
      }
    }

    await loadShoppingList()
  }

  async function toggleShoppingItem(item) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping-list/${item.ShoppingItemID}`,
        {
          method: "PUT",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            IsChecked:
              item.IsChecked ? 0 : 1,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to update shopping item",
        )
      }

      const updated =
        await response.json()

      setShoppingList((current) =>
        current.map((entry) =>
          entry.ShoppingItemID ===
          updated.ShoppingItemID
            ? updated
            : entry,
        ),
      )
    } catch (error) {
      setShoppingError(error.message)
    }
  }

  async function removeShoppingItem(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shopping-list/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      )

      if (!response.ok) {
        throw new Error(
          "Failed to remove shopping item",
        )
      }

      setShoppingList((current) =>
        current.filter(
          (item) =>
            item.ShoppingItemID !== id,
        ),
      )
    } catch (error) {
      setShoppingError(error.message)
    }
  }

  // ---------------------------------------------------------
  // HYDRATION
  // ---------------------------------------------------------

  async function updateHydration(newCount) {
    const safeCount = Math.max(newCount, 0)

    try {
      setHydrationError("")
      setHydrationLoading(true)

      const response = await fetch(
        `${API_BASE_URL}/hydration`,
        {
          method: "PUT",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            LogDate: selectedDate,
            Glasses: safeCount,
          }),
        },
      )

      if (!response.ok) {
        const detail =
          await response.json().catch(() => ({}))

        throw new Error(
          detail.detail ||
            "Failed to update hydration",
        )
      }

      const updated = await response.json()

      setHydration(updated.Glasses || 0)
    } catch (error) {
      setHydrationError(error.message)
    } finally {
      setHydrationLoading(false)
    }
  }

  function saveHydrationTarget(value) {
    const target = Number(value)
    if (!Number.isInteger(target) || target < 1) {
      return
    }
    setHydrationTarget(target)
    localStorage.setItem(
      getHydrationTargetKey(),
      String(target),
    )
  }

  // ---------------------------------------------------------
  // FORM RESET
  // ---------------------------------------------------------

  function resetRecipeForm() {
    setNewRecipe(emptyRecipe)
    setEditingRecipe(null)
    setRecipeFormError("")
    setRecipeFormOpen(false)
  }

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-background pb-24 text-on-surface">
      <main className="mx-auto max-w-[1100px] px-5 py-8 md:px-8 md:py-12">
        <section className="relative mb-10 overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-primary to-[#3D174B] px-6 py-10 text-white soft-shadow md:px-12 md:py-14">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#FFB3D1]">
              Everyday nourishment
            </p>

            <h1 className="mb-4 font-['Playfair_Display'] text-4xl font-semibold leading-tight md:text-5xl">
              A gentler guide to eating well
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/90 md:text-lg">
              Simple, flexible meal ideas for breakfast, lunch, and dinner, plus
              a routine you can adapt to your day, appetite, and food preferences.
            </p>
          </div>
          <span className="material-symbols-outlined absolute -bottom-12 -right-4 text-[210px] text-[#FFB3D1]/15 md:right-10">
            restaurant
          </span>
        </section>

        <section
          className="mb-12 rounded-3xl border border-outline-variant/70 bg-white p-6 soft-shadow md:p-8"
          aria-labelledby="daily-log-heading"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
                Personal daily record
              </p>

              <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
                Daily diet log
              </h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Record what you ate and review entries by date. Your log is saved in this browser.
              </p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-semibold text-primary">
              View date

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="rounded-xl border border-outline bg-surface-container px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>

          {dietLogError && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-risk-high/30 bg-tertiary-container px-4 py-3 text-sm text-on-tertiary-container"
            >
              {dietLogError}
            </p>
          )}

          <form
            onSubmit={addFoodEntry}
            className="mb-7 grid gap-4 rounded-2xl bg-surface-container p-4 md:grid-cols-2 md:p-5"
          >
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Meal

              <select
                value={mealType}
                onChange={(event) => setMealType(event.target.value)}
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                {trackedMealTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold">
              What did you eat?

              <input
                required
                value={food}
                onChange={(event) =>
                  setFood(
                    event.target.value,
                  )
                }
                placeholder="e.g. oats, banana, and yogurt"
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold">
              Portion / quantity

              <input
                value={portion}
                onChange={(event) =>
                  setPortion(event.target.value)
                }
                placeholder="e.g. 1 bowl"
                className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold md:col-span-2">
              Notes <span className="font-normal text-on-surface-variant">(optional)</span>
              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value,
                  )
                }
                rows={2}
                className="resize-y rounded-xl border border-outline-variant bg-white px-4 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-tertiary md:col-span-2 md:justify-self-end"
            >
              <span className="material-symbols-outlined">
                add
              </span>

              {dietLogLoading
                ? "Saving..."
                : editingDietEntry
                  ? "Update meal"
                  : "Add meal to log"}
            </button>

            {editingDietEntry && (
              <button
                type="button"
                onClick={resetDietForm}
                className="rounded-xl border border-[#e8e2cf] px-5 py-3 font-semibold md:col-span-2 md:justify-self-end"
              >
                Cancel
              </button>
            )}
          </form>

          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">
                {selectedDate === getLocalDate()
                  ? "Today's entries"
                  : selectedDate
                    ? `Entries for ${new Date(`${selectedDate}T12:00:00`).toLocaleDateString()}`
                    : "Choose a date"}
              </h3>
              <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
                {todaysEntries.length} {todaysEntries.length === 1 ? "meal" : "meals"}
              </span>
            </div>
            <p className="mb-4 text-sm text-on-surface-variant">
              {mainMealsLogged} of 3 main meal periods have entries. Snacks are optional.
            </p>

            <div>
              <p className="mt-2 text-2xl font-bold">
                {mainMealsLogged}/3
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf7f0] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#77776d]">
                Logged today
              </p>

              <p className="mt-2 text-2xl font-bold">
                {todaysEntries.length}
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf7f0] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#77776d]">
                Water
              </p>

              <p className="mt-2 text-2xl font-bold">
                {hydration}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {trackedMealTypes.map(
              (type) => (
                <section
                  key={type}
                  aria-label={`${type} entries`}
                  className="rounded-2xl border border-outline-variant p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold">{type}</h4>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      entriesByMeal[type].length
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container text-on-surface-variant"
                    }`}>
                      {entriesByMeal[type].length ? "Logged" : type === "Snack" ? "Optional" : "Not logged"}
                    </span>
                  </div>

                  {entriesByMeal[type]
                    .length ? (
                    <ul className="space-y-3">
                      {entriesByMeal[type].map((entry) => (
                        <li
                          key={entry.id}
                          className="flex items-start justify-between gap-3 rounded-xl bg-surface-container p-3"
                        >
                          <div className="min-w-0">
                            <p className="break-words text-sm leading-6">{entry.food}</p>
                            <p className="mt-1 text-xs text-on-surface-variant">{entry.time}</p>
                            {entry.notes && (
                              <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-on-surface-variant">
                                {entry.notes}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteFoodEntry(entry.DietLogID)}
                            aria-label={`Delete ${entry.mealType} entry`}
                            className="rounded-full p-2 text-on-surface-variant hover:bg-tertiary-container hover:text-risk-high"
                          >
                            <div>
                              <p className="text-sm">
                                {entry.Food}
                              </p>

                              {entry.Portion && (
                                <p className="mt-1 text-xs text-[#77776d]">
                                  Portion: {entry.Portion}
                                </p>
                              )}

                              {entry.Notes && (
                                <p className="mt-1 text-sm text-[#77776d]">
                                  {entry.Notes}
                                </p>
                              )}
                            </div>

                            <div className="flex shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  startEditingDietEntry(entry)
                                }
                                className="rounded-full p-2 text-[#77776d] hover:text-[#535845]"
                                aria-label="Edit meal"
                              >
                                <span className="material-symbols-outlined">
                                  edit
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteFoodEntry(entry.DietLogID)
                                }
                                className="rounded-full p-2 text-[#77776d] hover:text-[#9b4937]"
                                aria-label="Delete meal"
                              >
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </button>
                            </div>
                          </button>
                        </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-on-surface-variant">
                      No {type.toLowerCase()} recorded for this date.
                    </p>
                  )}
                </section>
              ),
            )}
          </div>

          <details className="mt-4 rounded-2xl border border-[#e8e2cf] bg-[#faf7f0] p-4">
            <summary className="cursor-pointer font-semibold text-[#535845]">
              Review this week’s meal history ({weekEntries.length})
            </summary>
            <ul className="mt-3 space-y-2">
              {weekEntries.length ? (
                weekEntries.map((entry) => (
                  <li
                    key={entry.DietLogID}
                    className="rounded-xl bg-white p-3 text-sm"
                  >
                    <span className="font-semibold">
                      {String(entry.LogDate).slice(0, 10)} · {entry.MealType}
                    </span>
                    <span> — {entry.Food}</span>
                    {entry.Portion && <span> ({entry.Portion})</span>}
                  </li>
                ))
              ) : (
                <li className="text-sm text-[#77776d]">
                  No meals recorded for this week.
                </li>
              )}
            </ul>
          </details>
        </section>

        {/* NUTRITION */}

        <section className="mb-12 rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm md:p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
            Today's overview
          </p>

          <h2 className="mb-2 font-['Playfair_Display'] text-3xl font-semibold">
            General nutrition check-in
          </h2>

          <p className="mb-6 text-sm leading-6 text-[#626258]">
            This is a simple reflection based on
            foods you logged. It does not calculate
            calories or diagnose nutritional deficiencies.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["meals", "Meals logged this week", "restaurant"],
              ["breakfast", "Breakfast", "wb_twilight"],
              ["lunch", "Lunch", "light_mode"],
              ["dinner", "Dinner", "bedtime"],
              ["snacks", "Snacks", "nutrition"],
              ["variety", "Different foods", "diversity_3"],
              ["vegetables", "Vegetable meals", "eco"],
              ["fruit", "Fruit meals", "nutrition"],
              ["protein", "Protein-food meals", "egg"],
              ["grains", "Grain meals", "grain"],
            ].map(
              ([key, label, icon]) => (
                <div
                  key={key}
                  className="rounded-2xl bg-[#faf7f0] p-4"
                >
                  <span className="material-symbols-outlined text-[#535845]">
                    {icon}
                  </span>

                  <p className="mt-2 text-sm font-semibold">
                    {label}
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#535845]">
                    {nutritionSummary[key]}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* RECIPES */}

        <section className="mb-12">
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
              Recipe collection
            </p>

            <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
              Recipes for your day
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#626258]">
              Search recipes, save favorites,
              create your own recipes, plan meals,
              and add ingredients to your shopping list.
            </p>
          </div>

          <div className="mb-5 grid gap-3 rounded-2xl bg-[#faf7f0] p-4 md:grid-cols-[1fr_auto_auto_auto]">
            <input
              type="text"
              value={recipeSearch}
              onChange={(event) =>
                setRecipeSearch(
                  event.target.value,
                )
              }
              placeholder="Search recipes or ingredients..."
              className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3"
            />

            <select
              value={recipeMealType}
              onChange={(event) =>
                setRecipeMealType(
                  event.target.value,
                )
              }
              className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3"
            >
              <option value="All">
                All meals
              </option>

              {trackedMealTypes.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ),
              )}
            </select>

            <select
              value={recipeSpecialFilter}
              onChange={(event) =>
                setRecipeSpecialFilter(event.target.value)
              }
              aria-label="Filter recipes"
              className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3"
            >
              {[
                ["All", "Any recipe type"],
                ["Vegetarian", "Vegetarian (meat-free)"],
                ["Quick", "Quick (20 minutes or less)"],
                ["No-cook", "No-cook (no cooking needed)"],
              ].map(([filter, label]) => (
                <option key={filter} value={filter}>
                  {label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() =>
                setShowFavoritesOnly(
                  (value) => !value,
                )
              }
              className={`rounded-xl px-4 py-3 font-semibold ${
                showFavoritesOnly
                  ? "bg-[#535845] text-white"
                  : "border border-[#e8e2cf] bg-white text-[#535845]"
              }`}
            >
              {showFavoritesOnly
                ? "Showing favorites"
                : "Favorites only"}
            </button>
          </div>

          <form
            onSubmit={generateRecipeSuggestion}
            className="mb-5 rounded-2xl bg-[#faf7f0] p-4"
          >
            <label className="mb-2 block text-sm font-semibold text-[#535845]">
              Recipe suggestions from your ingredients
            </label>
            <textarea
              value={recipeAssistantPrompt}
              onChange={(event) =>
                setRecipeAssistantPrompt(event.target.value)
              }
              rows={2}
              placeholder="Try: Kerala breakfast with puttu, or palappam with egg curry..."
              className="w-full rounded-xl border border-[#e8e2cf] bg-white px-4 py-3"
            />
            <p className="mt-2 text-xs text-[#77776d]">
              Suggestions use recipe and ingredient matching rules; no AI model is connected.
            </p>
            {recipeAssistantError && (
              <p className="mt-2 text-sm text-[#9b4937]">
                {recipeAssistantError}
              </p>
            )}
            <button
              type="submit"
              disabled={recipeAssistantLoading}
              className="mt-3 rounded-xl bg-[#535845] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {recipeAssistantLoading ? "Working..." : "Suggest a recipe"}
            </button>
            {recipeAssistantResult && (
              <div className="mt-4 rounded-xl border border-[#e8e2cf] bg-white p-4">
                <p className="font-semibold">{recipeAssistantResult.Name}</p>
                <p className="mt-1 text-xs text-[#77776d]">
                  {recipeAssistantResult.MealType} · {recipeAssistantResult.CookingTime}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm">
                  {recipeAssistantResult.Ingredients}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {recipeAssistantResult.Instructions}
                </p>
                <p className="mt-2 text-xs text-[#77776d]">
                  {recipeAssistantResult.SourceNote}
                </p>
                <button
                  type="button"
                  disabled={recipeAssistantLoading}
                  onClick={saveGeneratedRecipe}
                  className="mt-3 rounded-xl border border-[#535845] px-4 py-2 text-sm font-semibold text-[#535845] disabled:opacity-60"
                >
                  Add photo and save recipe
                </button>
              </div>
            )}
          </form>

          <div className="mb-5 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (recipeFormOpen) {
                  resetRecipeForm()
                } else {
                  setRecipeFormOpen(true)
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-[#535845] px-4 py-2.5 text-sm font-semibold text-[#535845]"
            >
              <span className="material-symbols-outlined">
                {recipeFormOpen ? "close" : "add"}
              </span>

              {recipeFormOpen
                ? "Close recipe form"
                : "Add personal recipe"}
            </button>
          </div>

          {recipeFormOpen && (
            <form
              id="recipe-form"
              onSubmit={saveRecipe}
              className="mb-6 rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-['Playfair_Display'] text-2xl font-semibold">
                  {editingRecipe
                    ? "Edit recipe"
                    : "Save your own recipe"}
                </h3>

                {editingRecipe && (
                  <span className="rounded-full bg-[#f3efdf] px-3 py-1 text-xs font-semibold text-[#535845]">
                    Editing personal recipe
                  </span>
                )}
              </div>

              {recipeFormError && (
                <p className="mb-4 rounded-xl border border-[#d9a18f] bg-[#fff4ef] px-4 py-3 text-sm text-[#9b4937]">
                  {recipeFormError}
                </p>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#e8e2cf] p-4 md:col-span-2">
                  <label
                    htmlFor="recipe-image"
                    className="mb-2 block text-sm font-semibold text-[#535845]"
                  >
                    Add your recipe photo (optional)
                  </label>
                  <input
                    id="recipe-image"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (!file) {
                        return
                      }
                      if (!file.type.startsWith("image/")) {
                        setRecipeFormError("Choose an image file.")
                        event.target.value = ""
                        return
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        setRecipeFormError("Recipe photos must be 5 MB or smaller.")
                        event.target.value = ""
                        return
                      }

                      const reader = new FileReader()
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          setNewRecipe((current) => ({
                            ...current,
                            ImageData: reader.result,
                          }))
                          setRecipeFormError("")
                        } else {
                          setRecipeFormError("Could not read that recipe photo.")
                        }
                      }
                      reader.onerror = () => {
                        setRecipeFormError("Could not read that recipe photo.")
                      }
                      reader.readAsDataURL(file)
                    }}
                    className="block w-full text-sm text-[#626258] file:mr-3 file:rounded-lg file:border-0 file:bg-[#f3efdf] file:px-3 file:py-2 file:font-semibold file:text-[#535845]"
                  />
                  <p className="mt-2 text-xs text-[#77776d]">
                    Pick a photo from your device, or leave this blank. No
                    image is assigned automatically to personal recipes.
                  </p>
                  {newRecipe.ImageData && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <img
                        src={newRecipe.ImageData}
                        alt="Recipe photo preview"
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNewRecipe((current) => ({
                            ...current,
                            ImageData: "",
                          }))
                        }
                        className="rounded-lg border border-[#e8e2cf] px-3 py-2 text-sm font-semibold text-[#535845]"
                      >
                        Remove photo
                      </button>
                    </div>
                  )}
                </div>

                <input
                  required
                  value={newRecipe.Name}
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      Name: event.target.value,
                    })
                  }
                  placeholder="Recipe name"
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3"
                />

                <select
                  value={newRecipe.MealType}
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      MealType:
                        event.target.value,
                    })
                  }
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3"
                >
                  {trackedMealTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    ),
                  )}
                </select>

                <textarea
                  required
                  value={
                    newRecipe.Ingredients
                  }
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      Ingredients:
                        event.target.value,
                    })
                  }
                  placeholder="Ingredients"
                  rows={3}
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3 md:col-span-2"
                />

                <textarea
                  required
                  value={
                    newRecipe.Instructions
                  }
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      Instructions:
                        event.target.value,
                    })
                  }
                  placeholder="Instructions"
                  rows={4}
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3 md:col-span-2"
                />

                <input
                  value={
                    newRecipe.CookingTime
                  }
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      CookingTime:
                        event.target.value,
                    })
                  }
                  placeholder="Cooking time"
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3"
                />

                <input
                  value={newRecipe.Notes}
                  onChange={(event) =>
                    setNewRecipe({
                      ...newRecipe,
                      Notes: event.target.value,
                    })
                  }
                  placeholder="Notes"
                  className="rounded-xl border border-[#e8e2cf] px-4 py-3"
                />

              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={recipeFormSaving}
                  className="rounded-xl bg-[#535845] px-5 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {recipeFormSaving
                    ? "Saving..."
                    : editingRecipe
                      ? "Update recipe"
                      : "Save recipe"}
                </button>

                <button
                  type="button"
                  onClick={resetRecipeForm}
                  className="rounded-xl border border-[#e8e2cf] px-5 py-3 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {recipesLoading && (
            <p className="rounded-2xl bg-white px-5 py-4 text-sm text-[#77776d] shadow-sm">
              Loading recipes...
            </p>
          )}

          {recipesError && (
            <p className="mb-4 rounded-xl border border-[#d9a18f] bg-[#fff4ef] px-4 py-3 text-sm text-[#9b4937]">
              {recipesError}
            </p>
          )}

          {favoritesLoading && (
            <p className="mb-4 text-xs text-[#77776d]">
              Syncing favorites...
            </p>
          )}

          {!recipesLoading &&
            filteredRecipes.length === 0 &&
            filteredKeralaRecipes.length === 0 && (
              <p className="rounded-2xl border border-[#e8e2cf] bg-white px-5 py-4 text-sm text-[#77776d]">
                No recipes match your search or filters.
              </p>
            )}

          {!recipesLoading &&
            filteredRecipes.length > 0 && (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredRecipes.map(
                  (recipe) => (
                    <RecipeCard
                      key={recipe.RecipeID}
                      recipe={recipe}
                      isFavorite={favoriteRecipes.includes(
                        recipe.RecipeID,
                      )}
                      isPersonal={
                        Number(recipe.UserID) === currentUserId
                      }
                      onToggleFavorite={
                        toggleFavorite
                      }
                      onAddToPlanner={
                        addToPlanner
                      }
                      onAddIngredients={
                        addRecipeIngredients
                      }
                      onOpen={
                        openRecipeDetails
                      }
                      onDelete={
                        deleteRecipe
                      }
                    />
                  ),
                )}
              </div>
            )}

          {!recipesLoading && filteredKeralaRecipes.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-4 font-['Playfair_Display'] text-2xl font-semibold">
                Kerala recipe details
              </h3>
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredKeralaRecipes.map((recipe) => {
                  const visual = getRecipeVisual(recipe)

                  return (
                    <article
                      key={recipe.RecipeID}
                      className="overflow-hidden rounded-3xl border border-[#e8e2cf] bg-white shadow-sm"
                    >
                      {visual.image ? (
                        <img
                          src={visual.image}
                          alt={visual.label}
                          className="h-52 w-full object-cover"
                          style={{ objectPosition: visual.imagePosition || "center" }}
                        />
                      ) : (
                        <div className="flex h-32 items-center justify-center bg-[#faf7f0] text-sm text-[#77776d]">
                          No verified dish photo available
                        </div>
                      )}
                      <div className="p-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#77776d]">
                          {recipe.MealType} · {recipe.CookingTime}
                        </p>
                        <h4 className="mt-2 font-['Playfair_Display'] text-2xl font-semibold">
                          {recipe.Name}
                        </h4>
                        {visual.credit && visual.source && (
                          <p className="mt-2 text-xs text-[#77776d]">
                            {visual.credit} ·{" "}
                            <a
                              href={visual.source}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              source
                            </a>
                          </p>
                        )}
                        <h5 className="mt-5 font-semibold">Ingredients</h5>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#626258]">
                          {recipe.Ingredients}
                        </p>
                        <h5 className="mt-4 font-semibold">Instructions</h5>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#626258]">
                          {recipe.Instructions}
                        </p>
                        <button
                          type="button"
                          onClick={() => openRecipeDetails(recipe)}
                          className="mt-5 rounded-xl bg-[#535845] px-4 py-2.5 font-semibold text-white"
                        >
                          Open recipe details
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* RECIPE DETAIL */}

        {recipeDetailsError && (
          <p
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {recipeDetailsError}
          </p>
        )}

        {selectedRecipe && (
          <section
            id="recipe-details-panel"
            className="mb-12 scroll-mt-6 rounded-3xl bg-[#535845] p-6 text-white shadow-sm md:p-8"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e5dfc8]">
                  Recipe details
                </p>

                <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
                  {selectedRecipe.Name}
                </h2>

                <p className="mt-2 text-sm text-[#e5dfc8]">
                  {selectedRecipe.MealType}
                  {selectedRecipe.CookingTime
                    ? ` · ${selectedRecipe.CookingTime}`
                    : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRecipe(null)
                }
                className="rounded-full bg-white/10 p-2"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">
                  Ingredients
                </h3>

                <p className="whitespace-pre-wrap text-sm leading-7 text-[#f3f0e6]">
                  {selectedRecipe.Ingredients}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">
                  Instructions
                </h3>

                <p className="whitespace-pre-wrap text-sm leading-7 text-[#f3f0e6]">
                  {selectedRecipe.Instructions}
                </p>
              </div>
            </div>

            {selectedRecipe.Notes && (
              <p className="mt-5 text-sm leading-6 text-[#e5dfc8]">
                {selectedRecipe.Notes}
              </p>
            )}

            {Number(selectedRecipe.UserID) === currentUserId && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    startEditingRecipe(
                      selectedRecipe,
                    )
                  }
                  className="rounded-xl bg-white px-4 py-2.5 font-semibold text-[#535845]"
                >
                  Edit recipe
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteRecipe(
                      selectedRecipe,
                    )
                  }
                  className="rounded-xl border border-white/40 px-4 py-2.5 font-semibold text-white"
                >
                  Delete recipe
                </button>
              </div>
            )}
          </section>
        )}

        {/* WEEKLY PLANNER */}

<section className="mb-12 rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm md:p-8">
  <div className="mb-5">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
      Weekly planning
    </p>

    <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
      Plan your meals
    </h2>

    <p className="mt-2 text-sm text-[#626258]">
      Your meal plans are stored in your account.
    </p>

    <label className="mt-4 flex max-w-xs flex-col gap-2 text-sm font-semibold">
      Week starting
      <input
        type="date"
        value={plannerWeekStart}
        onChange={(event) =>
          setPlannerWeekStart(getMondayDate(event.target.value))
        }
        className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal"
      />
    </label>
  </div>

  {plannerError && (
    <p className="mb-4 rounded-xl border border-[#d9a18f] bg-[#fff4ef] px-4 py-3 text-sm text-[#9b4937]">
      {plannerError}
    </p>
  )}

  {/* ADD TO PLAN */}
  <div className="mb-6 rounded-2xl bg-[#faf7f0] p-4 md:p-5">
    <div className="grid gap-4 md:grid-cols-3">
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Day
        <select
          value={plannerDay}
          onChange={(event) =>
            setPlannerDay(event.target.value)
          }
          className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#535845]/30"
        >
          {plannerDays.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold">
        Meal
        <select
          value={plannerMealType}
          onChange={(event) =>
            setPlannerMealType(event.target.value)
          }
          className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#535845]/30"
        >
          {trackedMealTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-2 text-sm font-semibold">
        <label htmlFor="planner-recipe-search">Find a recipe</label>
        <input
          id="planner-recipe-search"
          type="search"
          value={plannerRecipeSearch}
          onChange={(event) =>
            setPlannerRecipeSearch(event.target.value)
          }
          placeholder="Search Kerala dishes or ingredients..."
          className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#535845]/30"
        />
        <select
          aria-label="Select recipe to plan"
          value={selectedPlannerRecipe}
          onChange={(event) =>
            setSelectedPlannerRecipe(event.target.value)
          }
          className="rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#535845]/30"
        >
          <option value="">Select a recipe</option>
          {plannerRecipeOptions
            .filter((recipe) =>
              `${recipe.Name || ""} ${recipe.Ingredients || ""}`
                .toLowerCase()
                .includes(plannerRecipeSearch.trim().toLowerCase()),
            )
            .map((recipe) => (
              <option
                key={recipe.PlannerOptionID}
                value={recipe.PlannerOptionID}
              >
                {recipe.Name} · {recipe.MealType}
              </option>
            ))}
        </select>
      </div>
    </div>

    <button
      type="button"
      disabled={!selectedPlannerRecipe}
      onClick={() =>
        addToPlanner(selectedPlannerRecipe)
      }
      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#535845] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#444937] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[20px]">
        add
      </span>
      Add to Plan
    </button>

    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={plannerLoading}
        onClick={generateWeeklyPlan}
        className="rounded-xl border border-[#535845] px-4 py-3 font-semibold text-[#535845] disabled:opacity-60"
      >
        {plannerLoading ? "Saving plan..." : "Generate Weekly Plan"}
      </button>

      <button
        type="button"
        disabled={shoppingLoading}
        onClick={generateShoppingListFromPlan}
        className="rounded-xl border border-[#535845] px-4 py-3 font-semibold text-[#535845] disabled:opacity-60"
      >
        {shoppingLoading ? "Creating list..." : "Shopping list from this week"}
      </button>
    </div>
  </div>

  {/* SAVED PLANS */}
  {plannerLoading ? (
    <p className="text-sm text-[#77776d]">
      Loading planner...
    </p>
  ) : plannerRecipes.length ? (
    <div className="space-y-3">
      {plannerRecipes.map((item) => (
        <div
          key={item.PlannerID}
          className="flex items-center justify-between gap-4 rounded-2xl bg-[#faf7f0] p-4"
        >
          <div>
            <p className="font-semibold">
              {item.recipe?.Name || "Recipe"}
            </p>

            <p className="text-sm text-[#77776d]">
              {item.MealType}
            </p>

            <p className="mt-1 text-xs text-[#999]">
              {item.PlanDate}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              removeFromPlanner(item.PlannerID)
            }
            className="rounded-full p-2 text-[#77776d] hover:bg-[#f3efdf] hover:text-[#9b4937]"
            aria-label="Remove planned recipe"
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="rounded-2xl bg-[#faf7f0] p-4 text-sm text-[#77776d]">
      No {plannerMealType.toLowerCase()} recipes planned yet.
    </p>
  )}
</section>

        {/* PANTRY + SHOPPING */}

        <section className="mb-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
              Pantry
            </p>

            <h2 className="mb-2 font-['Playfair_Display'] text-2xl font-semibold">
              What do you have?
            </h2>

            <p className="mb-4 text-sm text-[#626258]">
              Pantry items are stored in your account.
            </p>

            {pantryError && (
              <p className="mb-3 rounded-xl bg-[#fff4ef] p-3 text-sm text-[#9b4937]">
                {pantryError}
              </p>
            )}

            <form
              onSubmit={addPantryItem}
              className="mb-4 flex gap-2"
            >
              <input
                value={pantryInput}
                onChange={(event) =>
                  setPantryInput(
                    event.target.value,
                  )
                }
                placeholder="e.g. matta rice, coconut, curry leaves"
                className="min-w-0 flex-1 rounded-xl border border-[#e8e2cf] px-4 py-3"
              />

              <button
                type="submit"
                disabled={pantryLoading}
                className="rounded-xl bg-[#535845] px-4 py-3 font-semibold text-white disabled:opacity-60"
              >
                Add
              </button>
            </form>

            <p className="mb-2 text-xs font-semibold text-[#77776d]">
              Kerala pantry ideas (select to fill the input)
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                "Matta rice",
                "Rice flour",
                "Black chickpeas",
                "Coconut",
                "Curry leaves",
                "Green gram",
                "Kudampuli",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPantryInput(item)}
                  className="rounded-full border border-[#e8e2cf] px-3 py-1.5 text-xs font-semibold text-[#535845] hover:bg-[#f3efdf]"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {pantry.map(
                (item) => (
                  <button
                    key={item.PantryItemID}
                    type="button"
                    onClick={() =>
                      removePantryItem(
                        item.PantryItemID,
                      )
                    }
                    className="rounded-full bg-[#f3efdf] px-3 py-2 text-xs font-semibold text-[#535845]"
                  >
                    {item.ItemName} ×
                  </button>
                ),
              )}
            </div>

            {pantry.length === 0 && !pantryLoading && (
              <p className="rounded-xl bg-[#faf7f0] p-3 text-sm text-[#77776d]">
                Add pantry ingredients to see recipes you can make now and
                recipes that need only a few more ingredients.
              </p>
            )}

            {pantry.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold">
                  {pantryMatches.some((match) => match.matchCount > 0)
                    ? "Meal ideas using your pantry"
                    : "Closest recipes to your pantry"}
                </p>

                {pantryLoading || recipesLoading ? (
                  <p role="status" className="text-sm text-[#77776d]">
                    Checking your pantry against available recipes...
                  </p>
                ) : pantryError || recipesError ? (
                  <p role="alert" className="text-sm text-[#9b4937]">
                    {pantryError || recipesError}
                  </p>
                ) : pantryMatches.length ? (
                  <div className="space-y-2">
                    {pantryMatches
                      .map((match) => (
                        <article
                          key={
                            match.recipe.RecipeID ||
                            normalizePantryIngredient(match.recipe.Name)
                          }
                          className="rounded-xl bg-[#faf7f0] p-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-[#535845]">
                                {match.recipe.Name}
                              </p>
                              <p className="mt-1 text-xs text-[#77776d]">
                                {match.recipe.MealType}
                                {match.recipe.CookingTime
                                  ? ` · ${match.recipe.CookingTime}`
                                  : ""}
                                {match.matchCount > 0
                                  ? ` · ${match.matchCount} ingredient${match.matchCount === 1 ? "" : "s"} available`
                                  : " · No direct pantry match"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => openRecipeDetails(match.recipe)}
                              className="rounded-lg border border-[#d9d3c1] px-3 py-2 text-xs font-semibold text-[#535845] hover:bg-white"
                            >
                              View full recipe
                            </button>
                          </div>
                          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                            <p className="text-[#535845]">
                              <span className="font-semibold">
                                {match.matchCount > 0
                                  ? "Available:"
                                  : "Closest ingredient name:"}
                              </span>{" "}
                              {match.matchCount > 0
                                ? match.availableIngredients.join(", ")
                                : match.closeMatches
                                    .map(
                                      (item) =>
                                        `${item.pantryName} ≈ ${item.ingredient}`,
                                    )
                                    .join(", ")}
                            </p>
                            <p className="text-[#77776d]">
                              <span className="font-semibold">
                                Missing ingredients:
                              </span>{" "}
                              {match.missingIngredients.length
                                ? match.missingIngredients.join(", ")
                                : "None"}
                            </p>
                          </div>
                        </article>
                      ))}
                  </div>
                ) : (
                  <p className="rounded-xl bg-[#faf7f0] p-3 text-sm text-[#77776d]">
                    {recipes.length
                      ? "No recipes use these pantry ingredients yet. Try another ingredient or add a recipe with these ingredients."
                      : "No recipes are available yet. Add recipes in the Recipe Collection and pantry suggestions will appear here."}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#e8e2cf] bg-white p-6 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
              Shopping list
            </p>

            <h2 className="mb-4 font-['Playfair_Display'] text-2xl font-semibold">
              Keep your next shop simple
            </h2>

            {shoppingError && (
              <p className="mb-3 rounded-xl bg-[#fff4ef] p-3 text-sm text-[#9b4937]">
                {shoppingError}
              </p>
            )}

            <form
              onSubmit={addShoppingItem}
              className="mb-4 flex gap-2"
            >
              <input
                value={shoppingInput}
                onChange={(event) =>
                  setShoppingInput(
                    event.target.value,
                  )
                }
                placeholder="Add an item"
                className="min-w-0 flex-1 rounded-xl border border-[#e8e2cf] px-4 py-3"
              />

              <button
                type="submit"
                disabled={shoppingLoading}
                className="rounded-xl bg-[#535845] px-4 py-3 font-semibold text-white disabled:opacity-60"
              >
                Add
              </button>
            </form>

            {shoppingList.length ? (
              <ul className="space-y-2">
                {shoppingList.map(
                  (item) => (
                    <li
                      key={
                        item.ShoppingItemID
                      }
                      className="flex items-center gap-2 rounded-xl bg-[#faf7f0] p-3"
                    >
                      <input
                        type="checkbox"
                        checked={
                          Boolean(
                            item.IsChecked,
                          )
                        }
                        onChange={() =>
                          toggleShoppingItem(
                            item,
                          )
                        }
                      />

                      <span
                        className={`min-w-0 flex-1 text-sm ${
                          item.IsChecked
                            ? "text-[#999] line-through"
                            : ""
                        }`}
                      >
                        {item.ItemName}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeShoppingItem(
                            item.ShoppingItemID,
                          )
                        }
                        className="rounded-full p-1 text-[#77776d] hover:text-[#9b4937]"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className="text-sm text-[#77776d]">
                Your shopping list is empty.
              </p>
            )}
          </div>
        </section>

        {/* HYDRATION */}

        <section className="mb-12 rounded-3xl bg-[#e5dfc8] p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77776d]">
                Hydration
              </p>

              <h2 className="font-['Playfair_Display'] text-2xl font-semibold">
                Keep a simple water record
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#55564b]">
                Water records are saved for the selected date.
                This is a simple tracker, not a medical target.
              </p>

              {hydrationError && (
                <p className="mt-3 text-sm text-[#9b4937]">
                  {hydrationError}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-[#535845]">
              Personal target
              <input
                type="number"
                min="1"
                step="1"
                value={hydrationTarget}
                onChange={(event) =>
                  saveHydrationTarget(event.target.value)
                }
                className="w-16 rounded-lg border border-[#d9d4c1] bg-white px-2 py-2 text-center"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={
                  hydrationLoading ||
                  hydration <= 0
                }
                onClick={() =>
                  updateHydration(
                    hydration - 1,
                  )
                }
                className="rounded-xl bg-white px-4 py-3 text-xl font-semibold text-[#535845] disabled:opacity-50"
              >
                −
              </button>

              <span className="min-w-20 text-center text-2xl font-bold text-[#535845]">
                {hydration}
                <span className="block text-xs font-normal">
                  of {hydrationTarget}
                </span>
              </span>

              <button
                type="button"
                disabled={hydrationLoading}
                onClick={() =>
                  updateHydration(
                    hydration + 1,
                  )
                }
                className="rounded-xl bg-[#535845] px-4 py-3 text-xl font-semibold text-white disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* MEAL SUGGESTIONS */}

        <section className="mb-12">
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
              Build a satisfying day
            </p>
            <h2
              id="meal-ideas-heading"
              className="font-['Playfair_Display'] text-3xl font-semibold text-plum-deep"
            >
              Meal suggestions
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
              Pick the ideas that suit you and swap ingredients freely. These
              are examples, not a strict meal plan.
            </p>
          </div>

          <div className="mb-5 rounded-2xl border border-[#e8e2cf] bg-[#faf7f0] p-4">
            <p className="text-sm font-semibold text-[#535845]">
              {smartSuggestion.personalized
                ? "A thought from your recent meal log"
                : "General idea while you build your meal history"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#626258]">
              {smartSuggestion.text}
            </p>
            {quickRecipe && (
              <p className="mt-2 text-sm text-[#626258]">
                Under-20-minute idea: {quickRecipe.Name} ({quickRecipe.CookingTime}).
              </p>
            )}
          </div>

          <label className="mb-5 block max-w-xl text-sm font-semibold text-[#535845]">
            Search meal ideas
            <input
              type="search"
              value={mealSearch}
              onChange={(event) => setMealSearch(event.target.value)}
              placeholder="Search puttu, fish curry, banana, or a meal type..."
              className="mt-2 w-full rounded-xl border border-[#e8e2cf] bg-white px-4 py-3 font-normal"
            />
          </label>

          {mealsLoading && (
            <p className="mb-4 text-sm text-[#77776d]">
              Loading meal suggestions...
            </p>
          )}

          {mealsError && (
            <p className="mb-4 rounded-xl border border-[#d9a18f] bg-[#fff4ef] px-4 py-3 text-sm text-[#9b4937]">
              {mealsError}
            </p>
          )}

          {!mealsLoading &&
            !mealsError &&
            filteredMeals.length === 0 && (
              <p className="rounded-2xl border border-[#e8e2cf] bg-white p-4 text-sm text-[#77776d]">
                {meals.length
                  ? "No meal ideas match your search."
                  : "No meal suggestions are available yet."}
              </p>
            )}

          <div className="grid gap-5 lg:grid-cols-3">
            {filteredMeals.map(
              (meal, index) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  index={index}
                  onOpenIdea={openMealIdea}
                />
              ),
            )}
          </div>
        </section>

        {/* FLEXIBLE PLATE */}

        <section className="mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-secondary-container p-6 md:p-8">
            <span className="material-symbols-outlined mb-4 text-[30px] text-secondary">
              nutrition
            </span>

            <h2 className="mb-3 font-['Playfair_Display'] text-2xl font-semibold">
              A flexible plate
            </h2>
            <p className="mb-5 text-sm leading-6 text-on-secondary-container">
              When it works for you, include a variety of colorful vegetables
              or fruit, a protein-rich food, and a grain or other energy-giving
              food. Add nourishing fats and calcium-containing foods across the
              day.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "Vegetables & fruit",
                "Protein",
                "Whole grains",
                "Calcium foods",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-on-secondary-container"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-outline-variant bg-white p-6 md:p-8 soft-shadow">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
              Make it your own
            </p>

            <h2 className="mb-5 font-['Playfair_Display'] text-2xl font-semibold">
              Small habits, no strict rules
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface-container p-4">
                <span className="material-symbols-outlined mb-2 text-secondary">water_drop</span>
                <h3 className="mb-1 text-sm font-bold">Keep water nearby</h3>
                <p className="text-sm leading-5 text-on-surface-variant">Drink regularly and adjust to your thirst, activity, and climate.</p>
              </div>
              <div className="rounded-2xl bg-surface-container p-4">
                <span className="material-symbols-outlined mb-2 text-secondary">schedule</span>
                <h3 className="mb-1 text-sm font-bold">Find a steady rhythm</h3>
                <p className="text-sm leading-5 text-on-surface-variant">A predictable meal pattern can help make planning easier.</p>
              </div>
              <div className="rounded-2xl bg-surface-container p-4">
                <span className="material-symbols-outlined mb-2 text-secondary">eco</span>
                <h3 className="mb-1 text-sm font-bold">Choose variety</h3>
                <p className="text-sm leading-5 text-on-surface-variant">Rotate foods you enjoy rather than relying on one “perfect” menu.</p>
              </div>
              <div className="rounded-2xl bg-surface-container p-4">
                <span className="material-symbols-outlined mb-2 text-tertiary">favorite</span>
                <h3 className="mb-1 text-sm font-bold">Notice what suits you</h3>
                <p className="text-sm leading-5 text-on-surface-variant">Personal comfort and dietary needs can differ from person to person.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WELLNESS CHECK-IN */}

        <section className="rounded-3xl border border-outline-variant bg-white p-6 soft-shadow md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
                Daily check-in
              </p>
              <h2 className="font-['Playfair_Display'] text-3xl font-semibold text-plum-deep">
                Small wins, your way
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                Mark any habits that felt good today. Your check-ins are saved
                by date in this browser and are optional—there is no perfect
                score to reach.
              </p>
            </div>
            <p className="shrink-0 rounded-full bg-secondary-container px-4 py-2 text-sm font-semibold text-on-secondary-container">
              {completedHabitCount} of {dailyHabits.length} checked
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {dailyHabits.map((habit) => (
              <label
                key={habit.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                  checkedDailyHabits[habit.id]
                    ? "border-secondary bg-secondary-container/60"
                    : "border-outline-variant bg-surface-container/50 hover:bg-surface-container"
                }`}
              >
                <input
                  type="checkbox"
                  checked={Boolean(checkedDailyHabits[habit.id])}
                  onChange={() => toggleWellnessHabit(habit.id)}
                  className="mt-1 h-4 w-4 accent-[#535845]"
                />
                <span className="material-symbols-outlined text-secondary">
                  {habit.icon}
                </span>
                <span className="text-sm font-semibold leading-5">
                  {habit.label}
                </span>
              </label>
            ))}
          </div>

          {wellnessHabitsError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-risk-high/30 bg-tertiary-container px-4 py-3 text-sm text-on-tertiary-container"
            >
              {wellnessHabitsError}
            </p>
          )}
        </section>

        <aside className="mt-10 rounded-2xl border border-secondary/30 bg-secondary-container p-5 text-sm leading-6 text-on-secondary-container">
          <strong className="text-primary">A note about personal needs:</strong>{" "}
          This is general wellness information, not a treatment plan. Allergies,
          medical conditions, medications, culture, and budget all affect what
          works. For tailored advice, speak with a registered dietitian or
          healthcare professional.
        </aside>
      </main>
    </div>
  )
}