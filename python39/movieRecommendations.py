import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
import xlsxwriter 

pd.set_option("large_repr", "info")
pd.set_option('display.max_columns', None)

'''
df = pd.read_csv('C:/Users/FBox/AppData/Local/Programs/Python/Python39/recentMovies2.csv', sep='/', header= 0)

genres = df['genres'].str.get_dummies(',')
writers = df['writers'].str.get_dummies(',')
actors = df['nconst'].str.get_dummies(',')
directors = df['directors'].str.get_dummies(',')



# Join the one hot encoded dataframe with the original dataframe
df = df.join(actors)
df = df.join(genres)
df = df.join(writers)
df = df.join(directors, lsuffix='_left', rsuffix='_right')


# Drop the original genres column
df.drop('genres', axis=1, inplace=True)
df.drop('writers', axis=1, inplace=True)
df.drop('nconst', axis=1, inplace=True)
df.drop('directors', axis=1, inplace=True)


df.to_csv('dfWithGWAD.csv', index=False)
print ("csv done")

'''
#df = pd.read_csv('C:/Users/FBox/AppData/Local/Programs/Python/Python39/df.csv', sep=',', header= 0)
#print(df.columns)

#content_attributes = df.columns.tolist()
#remove = ('tconst', 'titleType', 'primaryTitle', 'isAdult', 'startYear','directors', 'writers')


#print(content_attributes)

# Define the content attributes to use for recommendations
#content_attributes = ['runtimeMinutes', 'averageRating', 'numVotes', 'Action', 'Adult', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Musical', 'Mystery', 'News', 'Reality-TV', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western']
#content_attributes = ['runtimeMinutes', 'averageRating', 'numVotes', 'Action', 'Adult', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Musical', 'Mystery', 'News', 'Reality-TV', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western']

'''
df = pd.read_csv('C:/Users/FBox/AppData/Local/Programs/Python/Python39/dfwithGWAD.csv', sep=',', header= 0)

content_attributes = df.columns.tolist()

#print (content_attributes)




scaler = StandardScaler()
scaler.fit(df[keep])
df[keep] = scaler.transform(df[keep])
print(df.head(5))

df.to_csv('dfScaledGWAD.csv', index=False)
print('\n\n\n REACHED CHECK')
#print(df.head(5))

# add df with remove values (writers data and genres only), combine with dfTest
'''

df = pd.read_csv('C:/Users/FBox/AppData/Local/Programs/Python/Python39/dfScaledGWAD.csv', sep=',', header= 0)

content_attributes = df.columns.tolist()


remove = ('tconst', 'titleType', 'primaryTitle', 'isAdult', 'startYear',)
keep = ['runtimeMinutes', 'averageRating', 'numVotes']

for attribute in remove:
    content_attributes.remove(attribute)


X = sdf[content_attributes]
y = df['primaryTitle']

k = 30
nn = NearestNeighbors(n_neighbors=k)
nn.fit(X)

# Define a function to recommend df based on a query movie
def recommend_movies(query_movie):
    # Find the index of the query movie in the DataFrame
    query_index = df[df['primaryTitle'] == query_movie].index[0]
    
    # Find the k-nearest neighbors to the query movie, based on the content attributes
    neighbors = nn.kneighbors([X.iloc[query_index]])[1][0]
    
    # Recommend df similar to the k-nearest neighbors
    recommendations = df.loc[neighbors]['primaryTitle']
    
    return recommendations



query_movie = 'Pulp Fiction'
recommendations = recommend_movies(query_movie)
print(f"Movies similar to {query_movie}:")
print(recommendations)

#print(content_attributes)
#content_attributes.to_csv('contentAtr.csv', index=False)

writer = pd.ExcelWriter('NEWoutputGWAD2.xlsx', engine='xlsxwriter')

# Write the DataFrame to the Excel file
recommendations.to_excel(writer, sheet_name='Sheet1', index=False)

# Save the Excel file and close the writer object
writer.save()


