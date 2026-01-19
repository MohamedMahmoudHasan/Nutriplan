/**
 * NutriPlan - Main Entry Point
 * 
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

const searchFiltersSection = document.querySelector('#search-filters-section')
const mealCategoriesSection = document.querySelector('#meal-categories-section')
const allRecipesSection = document.querySelector('#all-recipes-section')
const mealDetails = document.querySelector('#meal-details')
const backToMealsBtn = document.querySelector('#back-to-meals-btn')

const mealDetailsHero = document.querySelector('#meal-details .Hero')
const mealDetailsAction = document.querySelector('#meal-details .Action')
const mealDetailsMain = document.querySelector('#meal-details .Main')


const searchInput = document.querySelector('#search-input')

const mealsAreasContainer = document.querySelector('#meals-areas')
const AllRecipes = document.querySelector('#All-Recipes')

const recipesGrid = document.querySelector('#recipes-grid')
const recipesCount = document.querySelector('#recipes-count')

const categoriesGrid = document.querySelector('#categories-grid')

const gridViewBtn = document.querySelector('#grid-view-btn')
const listViewBtn = document.querySelector('#list-view-btn')



async function getMealsAreas() {
    let response = await fetch('https://nutriplan-api.vercel.app/api/meals/areas');
    let mealsAreas = [];
    
    if (response.ok) {
        let data = await response.json();
        data.results.length = 10;
        for (let area of data.results) {
            mealsAreas.push(area.name);
            
        }
        
        return mealsAreas;
    }
    return [];
}
displayMealsAreas()
async function displayMealsAreas(){
    const areas = await getMealsAreas();
    let areasDisplay = ``
    for (let area of areas) {
        areasDisplay += `
            <button
                data-area = "${area}"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
            >
                ${area}
            </button>
        `
    }
    mealsAreasContainer.innerHTML=`
        <button
            data-area = "all"
            id="All-Recipes"
            class="px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all"
        >
            All Recipes
        </button>
        ${areasDisplay}
    `
}
mealsAreasContainer.addEventListener('click',(e)=>{
  
  for (let i = 0; i < mealsAreasContainer.children.length; i++) {
    mealsAreasContainer.children[i].classList.remove('bg-emerald-600','text-white','hover:bg-emerald-700')
    mealsAreasContainer.children[i].classList.add('bg-gray-100','text-gray-700','hover:bg-gray-200')
    
  }
  
  let areaBtn = e.target.closest('[data-area]')
  if(areaBtn.getAttribute('data-area') == 'all'){
    areaBtn.classList.add('bg-emerald-600','text-white' ,'hover:bg-emerald-700')
    areaBtn.classList.remove('bg-gray-100','text-gray-700' ,'hover:bg-gray-200')
    getRecipes()
  }else{
    getRecipesByArea(areaBtn.getAttribute('data-area'))
    areaBtn.classList.add('bg-emerald-600','text-white' ,'hover:bg-emerald-700')
    areaBtn.classList.remove('bg-gray-100','text-gray-700' ,'hover:bg-gray-200')
  }
})

getRecipes()
async function getRecipes() {
  displayRecipesSpin()
  let response = await fetch('https://nutriplan-api.vercel.app/api/meals/random?count=25');
  if (response.ok) {
      let data = await response.json();
      recipesCount.innerHTML = `Showing 25 recipes`
      displayRecipes(data.results)
  }

}

getCategories()
async function getCategories(){
  let response = await fetch('https://nutriplan-api.vercel.app/api/meals/categories');
  if (response.ok) {
      let data = await response.json();
      data.results.length = 12;
      for (let categories of data.results) {
          categoriesGrid.innerHTML +=`
              <div
              class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
              data-category="${categories.name}"
              >
                  <div class="flex items-center gap-2.5">
                      <div
                      class="bg-transparent text-white w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                      >
                    <img
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="${categories.thumbnail}"
                      alt="${categories.name}"
                      loading="lazy"
                      />
                      </div>
                      <div>
                      <h3 class="text-sm font-bold text-gray-900">${categories.name}</h3>
                      </div>
                  </div>
              </div>
          `

      }
  }
}
categoriesGrid.addEventListener('click',(e)=>{
  let catBtn = e.target.closest('[data-category]')
  getRecipesByCategory(catBtn.getAttribute('data-category'))
})

async function getRecipesById(id){
  let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/${id}`);
  if (response.ok) {
    let data = await response.json();
    let ingredients = []
    let nutritionHead = {}
    for (const ingredient of data.result.ingredients) {
      ingredients.push(`${ingredient["measure"]} ${ingredient["ingredient"]}`);
        
    }
    nutritionHead["recipeName"] = data.result.name
    nutritionHead["ingredients"] = ingredients

    let nutrit = await analyzeNutrition(nutritionHead) 
    displayMealDetailsHero(data.result,nutrit.data)
    displayMealDetailsMain(data.result,nutrit.data)
  }
}
async function analyzeNutrition(nutritionHead){
  const response = await fetch('https://nutriplan-api.vercel.app/api/nutrition/analyze', {
            method: 'POST', 
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json', 
                'x-api-key': 'i9CFSliRJPYpZeL5g14CcDctRO1O12cO5mWxLXhl'
            },
            body: JSON.stringify(nutritionHead)
        });
  if (response.ok) {
    return await response.json();
    // console.log(data)
  }
}
async function getRecipesByName(name){
  displayRecipesSpin()
  let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/search?q=${name}`);
  if (response.ok) {
    let data = await response.json();
    displayRecipes(data.results)
  }
}
async function getRecipesByArea(area){
  displayRecipesSpin()
  let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/filter?area=${area.toLowerCase()}&limit=25`);
  if (response.ok) {
    let data = await response.json();
    recipesCount.innerHTML =`Showing ${data.pagination.total>data.pagination.limit?data.pagination.limit:data.pagination.total} ${area} recipes`
    displayRecipes(data.results)
  }
}
async function getRecipesByCategory(category){
  displayRecipesSpin()
  let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/filter?category=${category.toLowerCase()}&limit=25`);
  if (response.ok) {
    let data = await response.json();
    displayRecipes(data.results)
  }
}

searchInput.addEventListener('input',()=>{
  searchInput.value == ''? getRecipes():getRecipesByName(searchInput.value.toLowerCase())
  
})

function displayRecipes(data){
  recipesGrid.innerHTML = ``
    for (let recipes of data) {
      recipesGrid.innerHTML +=`
          <div
        class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
        data-meal-id="${recipes.id}"
      >
        <div class="relative h-48 overflow-hidden">
          <img
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src="${recipes.thumbnail}"
            alt="${recipes.name}"
            loading="lazy"
          />
          <div class="absolute bottom-3 left-3 flex gap-2">
            <span
              class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
            >
              ${recipes.area}
            </span>
            <span
              class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
            >
              ${recipes.category}
            </span>
          </div>
        </div>
        <div class="p-4">
          <h3
            class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
          >
            ${recipes.name}
          </h3>
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">
            ${recipes.instructions}
          </p>
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-gray-900">
              <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
              ${recipes.category}
            </span>
            <span class="font-semibold text-gray-500">
              <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
              ${recipes.area}
            </span>
          </div>
        </div>
      </div>
      `
    }
}
function displayRecipesSpin(){
  recipesGrid.innerHTML = `
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    `
}

gridViewBtn.addEventListener('click',()=>{
  gridViewBtn.classList.add('bg-white')
  listViewBtn.classList.remove('bg-white')
  recipesGrid.classList.remove('grid-cols-2','gap-4')
  recipesGrid.classList.add('grid-cols-4','gap-5')
  for (let i = 0; i < recipesGrid.children.length; i++) {
    recipesGrid.children[i].classList.remove('flex','flex-row','h-40')
    recipesGrid.children[i].children[0].classList.remove('w-64','h-full','flex-shrink-0')
    recipesGrid.children[i].children[0].classList.add('h-48')
    recipesGrid.children[i].children[0].children[1].classList.remove('hidden')
    
  }
})

listViewBtn.addEventListener('click',()=>{
  gridViewBtn.classList.remove('bg-white')
  listViewBtn.classList.add('bg-white')
  recipesGrid.classList.remove('grid-cols-4','gap-5')
  recipesGrid.classList.add('grid-cols-2','gap-4')
  for (let i = 0; i < recipesGrid.children.length; i++) {
    recipesGrid.children[i].classList.add('flex','flex-row','h-40')
    recipesGrid.children[i].children[0].classList.remove('h-48')
    recipesGrid.children[i].children[0].classList.add('w-64','h-full','flex-shrink-0')
    recipesGrid.children[i].children[0].children[1].classList.add('hidden')
    
  }
})

recipesGrid.addEventListener('click',(e)=>{
  let recipeBtn = e.target.closest('[data-meal-id]')
  if(recipeBtn){
    searchFiltersSection.style.display = "none" 
    mealCategoriesSection.style.display = "none" 
    allRecipesSection.style.display = "none" 
    mealDetails.style.display = "block" 
    getRecipesById(recipeBtn.getAttribute('data-meal-id'))
  }
})
backToMealsBtn.addEventListener('click',()=>{
  searchFiltersSection.style.display = "block" 
  mealCategoriesSection.style.display = "block" 
  allRecipesSection.style.display = "block" 
  mealDetails.style.display = "none" 
})

async function displayMealDetailsHero(recipe,nutrit){
  let tags = ``
  for (const tag of recipe.tags) {
    tags+=`<span
            class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
            >${tag}</span
          >`
  }
  mealDetailsHero.innerHTML=`
    <div class="relative h-80 md:h-96">
      <img
        src="${recipe.thumbnail}"
        alt="${recipe.name}"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      ></div>
      <div class="absolute bottom-0 left-0 right-0 p-8">
        <div class="flex items-center gap-3 mb-3">
          <span
            class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
            >${recipe.category}</span
          >
          <span
            class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
            >${recipe.area}</span
          >
          ${tags}
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
          ${recipe.name}
        </h1>
        <div class="flex items-center gap-6 text-white/90">
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-clock"></i>
            <span>30 min</span>
          </span>
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-utensils"></i>
            <span id="hero-servings">${nutrit.servings} servings</span>
          </span>
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-fire"></i>
            <span id="hero-calories">${nutrit.perServing.calories} cal/serving</span>
          </span>
        </div>
      </div>
    </div>
  `
  
}
async function displayMealDetailsMain(recipe,nutrit){
  let i = 1
  let instructions = ``
  let ingredients = ``
  for (const instruction of recipe.instructions) {
    
    instructions+=`
    <div
      class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
    >
      <div
        class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
      >
        ${i}
      </div>
      <p class="text-gray-700 leading-relaxed pt-2">
        ${instruction}
      </p>
    </div>
    `
    i++
}
  for (const ingredient of recipe.ingredients) {
    ingredients+= 
      `

      <div
        class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
      >
        <input
          type="checkbox"
          class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
        />
        <span class="text-gray-700">
        <span class="font-medium text-gray-900">${ingredient["measure"]}</span> ${ingredient["ingredient"]}</span>
      </div>
      `
}
  mealDetailsMain.innerHTML=`
    <!-- Left Column - Ingredients & Instructions -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Ingredients -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto"
                    >${recipe.ingredients.length} items</span
                  >
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${ingredients}
                  
                </div>
              </div>

              <!-- Instructions -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                <div class="space-y-4">
                  ${instructions}
                </div>
              </div>

              <!-- Video Section -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-video text-red-500"></i>
                  Video Tutorial
                </h2>
                <div
                  class="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                >
                  <iframe
                    src="${getEmbedUrl(recipe.youtube)}"
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  >
                  </iframe>
                </div>
              </div>
            </div>

            <!-- Right Column - Nutrition -->
            <div class="space-y-6">
              <!-- Nutrition Facts -->
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2
                  class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div id="nutrition-facts-container">
                  <p class="text-sm text-gray-500 mb-4">Per serving</p>

                  <div
                    class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
                  >
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p class="text-4xl font-bold text-emerald-600">${nutrit.perServing.calories}</p>
                    <p class="text-xs text-gray-500 mt-1">Total: ${nutrit.totals.calories} cal</p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrit.perServing.protein}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-emerald-500 h-2 rounded-full"
                        style="width: ${nutrit.perServing.protein/nutrit.totals.protein*100}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrit.perServing.carbs}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full"
                        style="width: ${nutrit.perServing.carbs/nutrit.totals.carbs*100}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrit.perServing.fat}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-purple-500 h-2 rounded-full"
                        style="width: ${nutrit.perServing.fat/nutrit.totals.fat*100}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrit.perServing.fiber}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-orange-500 h-2 rounded-full"
                        style="width: ${nutrit.perServing.fiber/nutrit.totals.fiber*100}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrit.perServing.sugar}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-pink-500 h-2 rounded-full"
                        style="width: ${nutrit.perServing.sugar/nutrit.totals.sugar*100}%"
                      ></div>
                    </div>
                  </div>

                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">
                      Other
                    </h3>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${nutrit.perServing.cholesterol}mg</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${nutrit.perServing.sodium}mg</span>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
  `
  
}

function getEmbedUrl(videoUrl) {
    if (videoUrl.includes('watch?v=')) {
        const videoId = videoUrl.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return videoUrl;
}