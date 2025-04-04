const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector(".recipeContainer");
const recipeDetailsContent = document.querySelector('.recipeDetailsContent');
const recipeCloseBtn = document.querySelector('.recipeCloseBtn');
const recipeDetails = document.querySelector('.recipeDetails');

// Function to get recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        
        recipeContainer.innerHTML = "";
        
        if (response.meals) {
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                `;
                
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);
                
                // Adding EventListener to recipe button
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });
                
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = "<h2>No recipes found. Try another search.</h2>";
        }
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error fetching recipes. Please try again.</h2>";
        console.error('Error fetching recipes:', error);
    }
}

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul>${fetchIngredients(meal)}</ul>
        <div>
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    recipeDetails.style.display = "block";
}

// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== "") {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
}

// Close recipe popup
recipeCloseBtn.addEventListener('click', () => {
    recipeDetails.style.display = "none";
});

// Search form submission
document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipes(searchInput);
    }
});
