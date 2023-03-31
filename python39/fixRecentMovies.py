import pandas as pd

df = pd.read_csv('recentMovies.csv', delimiter='/')

df['directors'] = df['directors'].str.replace(r'nm(\d+)', r'dr\1', regex=True)
df['writers'] = df['writers'].str.replace(r'nm(\d+)', r'wr\1', regex=True)


df.to_csv('recentMovies2.csv', sep='/' ,index=False)