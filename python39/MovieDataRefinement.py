import pandas as pd

# Read data into data frames
movies = pd.read_csv('Data/Title Data/data.tsv', sep='\t', header= 0)
crews = pd.read_csv('Data/Writers and Directors Data/data.tsv', sep='\t', header= 0)
stars = pd.read_csv('Data/Stars full Data/data.tsv', sep='\t', header= 0)
ratings = pd.read_csv('Data/IMDB ratings Data/data.tsv', sep='\t', header= 0)
 

#Take top 3 actors/actress from movie to get 'stars' data
stars = stars[stars.ordering <= 3 ]
#Ensure that only actors/actress are included in list
stars = stars[stars["category"].str.contains("actor|actress") == True]

# Drop unnecessary columns
stars = stars.drop(['ordering', 'category', 'job', 'characters'], axis=1)

# Group people by movie
stars = stars.groupby('tconst')['nconst'].apply(",".join)

# Output refined data
stars.to_csv('Data/Stars refined Data/stars.csv', sep="/")  

# Merge dataframes on the the film title
df_train = movies.merge(crews, on='tconst', how='left')
df_train = df_train.merge(stars, on='tconst', how='outer')
df_train = df_train.merge(ratings, on='tconst', how='outer')  

# Drop unnecessary columns
df_train = df_train.drop(['endYear', 'originalTitle'], axis=1)

# Drop all results that are not a film
df_train = df_train[df_train.titleType == 'movie']

# Replace the null values in the data frame
df_train.replace(r'\s+|\\n', ' ', regex=True, inplace=True) 
df_train.replace(r'\s+|\\N', ' ', regex=True, inplace=True) 

# Drop null values in the data frame
df_train = df_train[df_train.startYear != ' ']
df_train = df_train[df_train.genres != ' ']
df_train = df_train[df_train.runtimeMinutes != ' ']

# Convert startYear (year released) to integer and then remove any movies released before 1980
df_train = df_train.astype({"startYear": int})
df_train = df_train[df_train.startYear >= 1940]

# Refine movie dataset to include threshold for inclusion
df_train = df_train[df_train.numVotes >= 7500]
df_train = df_train[df_train.averageRating >= 5]

# Create weighted average of rating to ensure that popularity is more accurately determined
mean_rating = df_train['averageRating'].mean()
min_votes = 7500 # set the minimum number of votes required
df_train['weightedAverage'] = (df_train['numVotes'] / (df_train['numVotes'] + min_votes)) * df_train['averageRating'] + (min_votes / (df_train['numVotes'] + min_votes)) * mean_rating

# Drop unnecessary columns now weighted average exists
df_train = df_train.drop(['numVotes', 'averageRating'], axis=1)

# Replace director and writer suffixes so roles can be easily identified in dataset
df_train['directors'] = df_train['directors'].str.replace(r'nm(\d+)', r'dr\1', regex=True)
df_train['writers'] = df_train['writers'].str.replace(r'nm(\d+)', r'wr\1', regex=True)

# Ouput final result
df_train.to_csv('Data/MovieSet.csv', sep="/", index=False)  

