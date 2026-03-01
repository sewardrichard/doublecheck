import pandas as pd
import requests

def shorten_url(url):
    """Calls TinyURL API and logs the attempt."""
    try:
        # Using TinyURL's public API
        api_url = f"http://tinyurl.com/api-create.php?url={url}"
        response = requests.get(api_url, timeout=10)
        
        if response.status_code == 200:
            short_url = response.text
            print(f"    [SUCCESS] {url} -> {short_url}")
            return short_url
        else:
            print(f"    [FAILED]  {url} (Status: {response.status_code})")
            return url
    except Exception as e:
        print(f"    [ERROR]   {url} ({str(e)})")
        return url

def process_row(row):
    """Processes the row, handles split links, and logs the officer name."""
    officer = row['Loan_Officer']
    contact_str = row['Contact']
    
    print(f"\nProcessing Officer: {officer}")
    
    if pd.isna(contact_str):
        print("    [SKIP] No contact link found.")
        return contact_str
    
    # Handle multiple links separated by '|'
    links = [link.strip() for link in str(contact_str).split('|')]
    
    if len(links) > 1:
        print(f"    [INFO] Found {len(links)} links. Shortening individually...")
        
    shortened_results = [shorten_url(link) for link in links]
    return " | ".join(shortened_results)

# 1. Load the data
df = pd.read_csv('loan_officers_table.csv')

print("--- STARTING PROCESSING ---")

# 2. Apply the function with logging
df['Contact'] = df.apply(process_row, axis=1)

print("\n--- PROCESSING COMPLETE ---")

# 3. Create the final clean output
final_df = df[['Loan_Officer', 'Contact']]

# 4. Display the first few rows of the final result
print("\n--- FINAL TABLE PREVIEW ---")
print(final_df.head(10).to_string(index=False))

# 5. Save to file
final_df.to_csv('shortened_links_log.csv', index=False)