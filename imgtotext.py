from pytesseract import pytesseract
import sys
import os

# Path to tesseract executable
pytesseract.tesseract_cmd = "/usr/bin/tesseract"

def extract_text(image_path):
    if not os.path.exists(image_path):
        print(f"ERROR: File not found - {image_path}")
        return
    try:
        text = pytesseract.image_to_string(image_path)
        print(text.strip())
    except Exception as e:
        print("ERROR")
        print(e)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: No image path provided")
    else:
        extract_text(sys.argv[1])
