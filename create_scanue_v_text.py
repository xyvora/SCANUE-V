import os

def create_combined_files():
    """Combines all Python files into a single text file for review."""
    with open('combined_files.txt', 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk('.'):
            for file in files:
                if file.endswith('.py'):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(f"\n{'='*50}\n")
                            outfile.write(f"File: {file}\n")
                            outfile.write(f"{'='*50}\n\n")
                            outfile.write(infile.read())
                            outfile.write("\n\n")
                    except Exception as e:
                        print(f"Error processing {file}: {str(e)}")

if __name__ == "__main__":
    create_combined_files()
    print("Files have been combined into combined_files.txt")