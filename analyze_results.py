import os
import json
import pandas as pd
import matplotlib.pyplot as plt

# --- Configuration ---
RESULT_DIR = 'result'
METHODS = ['GSAD', 'RetinexFormer', 'CID', 'Ours','LightenDiff']

def parse_results(file_path):
    """
    Reads a single JSON result file and converts it into a flattened Pandas DataFrame.
    DataFrame structure: [image, method, rank]
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error: File '{file_path}' is not a valid JSON file.")
        return None

    records = []
    for image_result in data.get('results', []):
        image_name = image_result.get('imageName')
        for method, rank in image_result.get('ranking', {}).items():
            records.append({
                'image': image_name,
                'method': method,
                'rank': rank
            })
            
    if not records:
        print(f"Warning: No valid ranking data found in '{file_path}'.")
        return None
        
    return pd.DataFrame(records)


def analyze_and_plot(df, title_prefix):
    """
    Performs analysis and plotting on the given DataFrame.
    1. Calculates and prints the average rank for each method.
    2. Calculates and plots the distribution of ranks for each method.
    """
    if df is None or df.empty:
        print("Data is empty. Analysis aborted.")
        return

    # --- 1. Calculate Average Ranks ---
    print("\n" + "="*35)
    print(f"{title_prefix}: Average Rank (Lower is Better)")
    print("="*35)
    avg_ranks = df.groupby('method')['rank'].mean().sort_values()
    print(avg_ranks.to_string())
    print("-" * 35)

    # --- Calculate Top1 and Top2 Percentages ---
    method_counts = df['method'].value_counts()
    top1_counts = df[df['rank'] == 1]['method'].value_counts()
    top2_counts = df[df['rank'].isin([1, 2])]['method'].value_counts()
    
    print(f"\n{title_prefix}: Top1 and Top2 Percentages")
    print("="*40)
    print(f"{'Method':<15} {'Top1%':<10} {'Top2%':<10}")
    print("-" * 40)
    
    for method in sorted(method_counts.index):
        total = method_counts[method]
        top1_pct = (top1_counts.get(method, 0) / total) * 100
        top2_pct = (top2_counts.get(method, 0) / total) * 100
        print(f"{method:<15} {top1_pct:>6.2f}%   {top2_pct:>6.2f}%")
    print("="*40)

    # --- 2. Calculate and Plot Rank Distribution ---
    rank_counts = pd.crosstab(df['method'], df['rank'])
    
    # Ensure all rank columns (1, 2, 3, 4) exist, filling with 0 if necessary
    for rank_val in [1, 2, 3, 4]:
        if rank_val not in rank_counts.columns:
            rank_counts[rank_val] = 0
    rank_counts = rank_counts.reindex(columns=[1, 2, 3, 4]) # Ensure order

    # Convert counts to percentages
    rank_percentages = rank_counts.div(rank_counts.sum(axis=1), axis=0) * 100

    print(f"\n{title_prefix}: Distribution of Ranks for Each Method (%)")
    print("-" * 35)
    print(rank_percentages.to_string(float_format="%.2f%%"))
    print("="*35)

    # --- Plotting Section ---
    # Define intuitive colors: green for good ranks, red for bad ranks
    colors = {
        1: '#2ca02c',  # Vivid Green (Rank 1)
        2: '#98df8a',  # Light Green (Rank 2)
        3: '#ff7f0e',  # Orange (Rank 3)
        4: '#d62728'   # Red (Rank 4)
    }
    
    # Plotting the DataFrame directly. The index ('method') becomes the x-axis groups.
    ax = rank_percentages.plot(
        kind='bar',
        figsize=(14, 8),
        width=0.8,
        edgecolor='black',
        color=[colors.get(col, '#888888') for col in rank_percentages.columns]
    )

    # --- Beautify the Chart ---
    plt.title(f'{title_prefix}: Distribution of Ranks for Each Method', fontsize=18, pad=20)
    plt.xlabel('Enhancement Method', fontsize=14, labelpad=15)
    plt.ylabel('Percentage of Votes (%)', fontsize=14, labelpad=15)
    plt.xticks(rotation=0, fontsize=12)
    plt.yticks(fontsize=12)
    plt.legend(title='Rank', fontsize=11)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout() # Adjust layout to prevent labels from overlapping
    
    # Add percentage labels on top of each bar
    for container in ax.containers:
        ax.bar_label(container, fmt='%.1f%%', fontsize=10, padding=3)
    
    plt.show()


def main():
    """Main function to provide the user interface."""
    if not os.path.exists(RESULT_DIR) or not os.listdir(RESULT_DIR):
        print(f"Error: Results folder '{RESULT_DIR}/' does not exist or is empty.")
        print("Please place all .json result files into this folder first.")
        return

    while True:
        print("\n--- Image Enhancement Result Analysis Tool ---")
        print("1. Analyze a single result file")
        print("2. Analyze all result files combined")
        print("q. Quit")
        choice = input("Enter your choice (1/2/q): ").strip()

        if choice == '1':
            files = sorted([f for f in os.listdir(RESULT_DIR) if f.endswith('.json')])
            if not files:
                print(f"No .json files found in the '{RESULT_DIR}/' folder.")
                continue
                
            print("\nAvailable result files:")
            for i, f in enumerate(files):
                print(f"{i+1}. {f}")
            
            try:
                file_choice_input = input("Enter the number of the file to analyze: ")
                file_choice = int(file_choice_input) - 1
                if 0 <= file_choice < len(files):
                    file_path = os.path.join(RESULT_DIR, files[file_choice])
                    df = parse_results(file_path)
                    analyze_and_plot(df, f"Single File Analysis ({files[file_choice]})")
                else:
                    print("Invalid number.")
            except ValueError:
                print("Invalid input. Please enter a number.")

        elif choice == '2':
            all_files = [os.path.join(RESULT_DIR, f) for f in os.listdir(RESULT_DIR) if f.endswith('.json')]
            if not all_files:
                print(f"No .json files found in the '{RESULT_DIR}/' folder.")
                continue
            
            all_dfs = [parse_results(f) for f in all_files]
            all_dfs = [df for df in all_dfs if df is not None]

            if not all_dfs:
                print("All files could not be parsed or were empty.")
                continue

            combined_df = pd.concat(all_dfs, ignore_index=True)
            analyze_and_plot(combined_df, f"Combined Analysis ({len(all_dfs)} files)")

        elif choice.lower() == 'q':
            print("Thank you for using the tool. Goodbye!")
            break
        else:
            print("Invalid input. Please enter 1, 2, or q.")


if __name__ == '__main__':
    main()