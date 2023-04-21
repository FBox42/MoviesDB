import pandas as pd
import os
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler
from dotenv import load_dotenv
import pymongo
load_dotenv()

DB_PASSWORD = os.getenv('DB_PASSWORD')



#Set pandas options to display max info
pd.set_option("large_repr", "info")
pd.set_option('display.max_columns', None)


#Read in refined data set
df = pd.read_csv('Data/MovieSet.csv', sep='/', header= 0)


#Set weights used in recommendations
director_weight = 2
genres_weight = 2
year_weight = 1.2


#One hot encode variables
genres = df['genres'].str.get_dummies(',')
writers = df['writers'].str.get_dummies(',')
actors = df['nconst'].str.get_dummies(',')
directors = df['directors'].str.get_dummies(',')

#Apply weights to variables
directors = directors.apply(lambda x: x * director_weight)
genres = genres.apply(lambda x: x * genres_weight)
df['startYear'] = df['startYear'] * year_weight


# Join the one hot encoded dataframe with the original dataframe
df = df.join(actors)
df = df.join(genres)
df = df.join(writers)
df = df.join(directors, lsuffix='_left', rsuffix='_right')


# Drop the original variable columns
df.drop('genres', axis=1, inplace=True)
df.drop('writers', axis=1, inplace=True)
df.drop('nconst', axis=1, inplace=True)
df.drop('directors', axis=1, inplace=True)


#Output DF to csv file for debugging 
#df.to_csv('dfWithGWADohe.csv', index=False)

#Create attribute list to be scaled
attributesToKeep = ['runtimeMinutes', 'weightedAverage', 'startYear']

#Get all column attributes
content_attributes = df.columns.tolist()

#Create list of unneeded attributes 
remove = ('tconst', 'titleType', 'primaryTitle', 'isAdult')

#Remove unneeded attributes
for attribute in remove:
    content_attributes.remove(attribute)


#Scale data and then output to csv file for inspection
scaler = MinMaxScaler()
df[attributesToKeep] = scaler.fit_transform(df[attributesToKeep])

#Output scaled data for debugginh
#df.to_csv('ScaledMovieData3.csv', index=False)




#Set x and y attributes for ML 
X = df[content_attributes]
y = df['primaryTitle']

#Set number of recommendations and ML algorithm, then fit the dataset using content attributes
k = 25
nn = NearestNeighbors(n_neighbors=k)
nn.fit(X)

# Define function to return recommendations based on a query movie
def recommend_movies(query_movie):

    # Find the index of the query movie in the DataFrame
    query_index = df[df['primaryTitle'] == query_movie].index[0]
    
    # Find the nearest neighbors to the query movie, based on the content attributes
    neighbors = nn.kneighbors([X.iloc[query_index]])[1][0]
    
    #Set recommendation as the movie ID found above and then return
    recommendations = df.loc[neighbors]['tconst']
    
    return recommendations


#Create connection to MongoDB 
client = pymongo.MongoClient("mongodb+srv://fbox:"+ DB_PASSWORD + "@moviesdb.oqspgh2.mongodb.net/?retryWrites=true&w=majority")

#Set MongoDB collection to export to 
mydb = client["MovieDB"]
mycol = mydb["Recommendations"]

dfSubset = df['primaryTitle']
query_list = dfSubset.tolist()

#Set variables for loop
counter = 0
tconst = ''

#Loop for every movie in the dataset to gain recommendations and then add to MongoDB collection
for query in query_list:

    #Setting loop variables
    recommendationsArray = []
    y=0
    query_movie = query

    #Call to recommendation function with current movie
    recommendations = recommend_movies(query_movie)
    
    #Debug output to view recommendations
    #print(f"Movies similar to {query_movie}:")
    #print(recommendations)

    #Get current movie title 
    tconst = df.loc[df['primaryTitle'] == query, 'tconst'].iloc[0]

    
    #Remove the original title from the recommendation list and append other recommendations to list
    for recommendation in recommendations:
        if y==0 :
            y=y+1        
        else:
            recommendationsArray.append(recommendation)
            y=y+1
        
    # Create list including the current movie, and then array of the recommendations, this is used to output to MongoDB
    mylist = [{ "tconst": tconst, "primaryTitle": query, "Recommendations": recommendationsArray},]

    #Insert movie into DB collection
    x = mycol.insert_many(mylist)

    #print list of the _id values of the inserted documents:
    print(x.inserted_ids)

    #Increase loop counter for next movie
    counter = counter+1

