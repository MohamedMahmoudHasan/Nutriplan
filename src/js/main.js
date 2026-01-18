/**
 * NutriPlan - Main Entry Point
 * 
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

let mealsAreasContainer = document.querySelector('#meals-areas')



// console.log(getMealsAreas());


async function getMealsAreas() {
    let response = await fetch('https://nutriplan-api.vercel.app/api/meals/areas');
    let mealsAreas = [];
    
    if (response.ok) {
        let data = await response.json();
        for (let area of data.results) {
            mealsAreas.push(area.name);
            if (area.name == 'Egyptian') break;
        }
        return mealsAreas;
    }
    return [];
}

async function displayMealsAreas(){
    const areas = await getMealsAreas();
    
}
