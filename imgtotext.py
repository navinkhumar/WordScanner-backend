from pytesseract import pytesseract
import sys
import os

pytesseract.tesseract_cmd = "/usr/bin/tesseract"

def extract_text(image_path):
    if not os.path.exists(image_path):
        print(f"ERROR: File not found - {image_path}")
        return 1  

    try:
        text = pytesseract.image_to_string(image_path)
        print(text.strip())
        return 0  # success
    except Exception as e:
        print("ERROR:", e)
        return 1  # error

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: No image path provided")
        sys.exit(1)
    exit_code = extract_text(sys.argv[1])
    sys.exit(exit_code)
