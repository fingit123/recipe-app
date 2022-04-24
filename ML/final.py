import numpy as np
import pandas as pd
# import matplotlib.pyplot as plt
# import matplotlib.patches as mpatches
import ast 

ingredientsDF = pd.read_csv('file.csv')
rawRecipesDF = pd.read_csv('RAW_recipes.csv') 
rawInteractionsDF = pd.read_csv('RAW_interactions.csv')

recipes= rawRecipesDF.copy()
recipes = recipes[['name','id','minutes','nutrition','n_steps','steps','description','ingredients','n_ingredients']]
recipes.drop([144074,109624],inplace = True) 
mappingDict = dict(ingredientsDF[['raw_ingr','replaced']].values) 
mappingDictBack=dict(ingredientsDF[['replaced','raw_ingr']].values) 
def mapInnerList(innerList):
    for i in range(len(innerList)):
        innerList[i]=mappingDict.get(innerList[i],innerList[i]) #get key value at index or keep original entry if key not found
    return innerList    

recipes['ingredients']=rawRecipesDF['ingredients'].apply(ast.literal_eval)
recipes['baseIngrType']= recipes['ingredients'].apply(lambda inLst: mapInnerList(inLst)) 
recipes['ingredients']=rawRecipesDF['ingredients'].apply(ast.literal_eval)
recipes['nutrition']=recipes['nutrition'].apply(ast.literal_eval) #change lists '[chicken]' to [chicken]
recipes['steps']=recipes['steps'].apply(ast.literal_eval) 
recipes['ingredients']=recipes['ingredients'].apply(lambda itemsLst: [x.lower() for x in itemsLst])
avgRatings=rawInteractionsDF.groupby(by='recipe_id').mean()['rating'].reset_index()
numRatings = rawInteractionsDF.groupby(by='recipe_id').count()['review'].reset_index()

ratingsAggregated=pd.merge(left=avgRatings,right=numRatings,left_on='recipe_id',right_on='recipe_id')
recipes=pd.merge(left=recipes,right=ratingsAggregated,how="left",left_on='id',right_on='recipe_id')

def getRecipes(ingredients):
    
    ingredients =[ings.lower() for ings in ingredients] 
    
    ingredientsA=ingredients
    ingredientsB=ingredients

    for i in range(len(ingredientsB)): 
        ingredientsB[i]=mappingDictBack.get(ingredientsB[i],ingredientsB[i])
    
    baseIngRecipes=recipes[recipes['ingredients'].apply(lambda inLst: set(ingredientsB)<=set(inLst))]
    
    for i in range(len(ingredientsA)):
            ingredientsA[i]=mappingDict.get(ingredientsA[i],ingredientsA[i]) 
        
    rawIngRecipes=recipes[recipes['baseIngrType'].apply(lambda inLst: set(ingredientsA)<=set(inLst))]
    
    
    combined=pd.concat([rawIngRecipes,baseIngRecipes]).reset_index()
    combined=combined.drop_duplicates(subset='index')
    
    try:
        #Results returned
        if(combined.empty and len(ingredients)>1): 
            print("No recipes found. Please enter one of the ingredients to remove and search again."
                 +"\nHere are the ingredients being used: " + str(ingredients))
            
            keepRem = True
            while(keepRem):
                remIng=input()
                ingredients.remove(remIng.lower())
                combined = getRecipes(ingredients) 
                keepRem=False
        elif(combined.empty and len(ingredients)<=1):
            print("No recipes found with passed ingredients or too little ingredients.")
            
        return combined 
            
    except ValueError:
        print("ValueError BECAUSE invalid input you passed. Only remove ingredients passed in.")


def getStepsFromList(innerList):
    for i in range(len(innerList)):
        print("Step "+str(i+1)+": "+innerList[i]+"\n")

def getIngredientsFromList(innerList):
    print("All ingredients needed:\n")
    for i in range(len(innerList)-1):
        print(innerList[i].capitalize()+", ")
    print(innerList[len(innerList)-1].capitalize()
          +".\nTry the recipe yourself!\n") 


def BarTopRecipes(results,maxBarsNum=5):
    
    topRes= results.copy()
    topRes.sort_values(by=['review','rating'],ascending=False,inplace=True) 
    topRes['nutritionNOCAL']=topRes['nutrition'].apply(lambda inLst: inLst[1:])
    topRes= topRes.head(maxBarsNum)
    

    barXpos=np.array([1,2,3,4,5,6])
    topRecipes= topRes[['name','nutrition','nutritionNOCAL']]
    

    labels='Total Fat (%),Sugars (%),Sodium (%),Protein (%),Saturated Fat (%),Total Carbohydrates (%)'.split(",")
    handles=[]
    colors=['lightblue','orangered','navy','green','purple','plum']
    

    highestBar=topRecipes['nutritionNOCAL'].apply(lambda inLst: max(inLst)).max()

    final = []
    for i in range(len(topRecipes)):
        rec = []


        rec.append(topRecipes['nutritionNOCAL'].iloc[i])
        
        rec.append(topRecipes['name'].values[i])
        topBar=max(topRecipes['nutritionNOCAL'].iloc[i])
        rec.append(str(topRecipes['nutrition'].values[i][0])+" Calories")

        final.append(rec)


    return final
ingredients_list = ['chicken','salt','cucumber']
#this function returns a 2D list with the top 4 recipes 
#example output
#[[total fat%, sugar%, sodium%, protein%, saturated fat%, total carbohydrates%], recipe name, calories]
#[[[72.0, 60.0, 89.0, 126.0, 67.0, 50.0], 'hainanese chicken rice', '1294.6 Calories']
print(BarTopRecipes(getRecipes(ingredients_list),4))




# def BarTopRecipes(results,maxBarsNum=5):
    
#     #Copy of results so no issue if any alteration made and TAKING MAX 5 recipes
#     topRes= results.copy()
#     topRes.sort_values(by=['review','rating'],ascending=False,inplace=True) #DESCENDING BASED ON RATING AND #REVIEWS
#     topRes['nutritionNOCAL']=topRes['nutrition'].apply(lambda inLst: inLst[1:])
#     topRes= topRes.head(maxBarsNum) #Shows top 5 or less results
    
#     #Taking vals for xpositions of bar
#     barXpos=np.array([1,2,3,4,5,6])
#     topRecipes= topRes[['name','nutrition','nutritionNOCAL']]
    
#     #LABELS AND COLORS
#     labels='Total Fat (%),Sugars (%),Sodium (%),Protein (%),Saturated Fat (%),Total Carbohydrates (%)'.split(",")
#     handles=[]
#     colors=['lightblue','orangered','navy','green','purple','plum']
    
#     #height of TALLEST BAR
#     highestBar=topRecipes['nutritionNOCAL'].apply(lambda inLst: max(inLst)).max()

#     #Setting the PLAIN GRAPH FIRST
#     # plt.figure(figsize=(20,10))
    
    
#     #Title
#     # plt.ylim(top=highestBar+25) #SET YLIM so if highest bar is first recipe, it won't block the title since +20 y space set and title set at +10 (see below)
#     # plt.text(0.25,highestBar+10,"Nutrition Percentage Daily Value (PDV)" , 
#     #          fontsize=16,
#     #          rotation=0,
#     #          color='Black',fontweight='bold',
#     #          bbox=dict(boxstyle='round', facecolor='salmon', alpha=0.5),
#     #         )

#     #Calories numbers and barplot for each recipe
#     final = []
#     for i in range(len(topRecipes)):
#         rec = []


#         # plt.bar(x= 8*i + barXpos, height=topRecipes['nutritionNOCAL'].iloc[i], color =colors)
#         rec.append(topRecipes['nutritionNOCAL'].iloc[i])
        
#         #Name values
#         # plt.xticks([num*8 +3.5 for num in range(len(topRecipes))], topRecipes['name'].values,rotation=0, fontsize=15
#         #           ,color='crimson',fontweight='bold')
#         rec.append(topRecipes['name'].values[i])
#         #Nutrition column since need Calorie number
#         topBar=max(topRecipes['nutritionNOCAL'].iloc[i])
#         # plt.text(8*i +1,topBar+2, str(topRecipes['nutrition'].values[i][0])+" Calories", 
#         #          fontsize=14, rotation=0,
#         #          color='teal',fontweight='heavy')
#         rec.append(str(topRecipes['nutrition'].values[i][0])+" Calories")

#         final.append(rec)



#     #legend
#     # for i in range(len(colors)):
#     #     handles.append(mpatches.Patch(color=colors[i], label=labels[i]))

#     # plt.legend(handles=handles, loc='lower left',bbox_to_anchor=(0, 1.01,10,10),
#     #            ncol=len(colors),fontsize=15)
    
#     # #show
#     # plt.style.use('fast')
#     # plt.savefig("output.jpg") 
#     return final