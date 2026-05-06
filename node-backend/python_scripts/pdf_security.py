import sys
import argparse
from pypdf import PdfReader, PdfWriter

def main():
    parser = argparse.ArgumentParser(description="PDF Security Script")
    parser.add_argument("action", choices=["unlock", "protect"], help="Action to perform")
    parser.add_argument("input", help="Path to input PDF")
    parser.add_argument("output", help="Path to output PDF")
    parser.add_argument("--password", help="Password for decryption/encryption", default="")

    args = parser.parse_args()

    try:
        reader = PdfReader(args.input)
        writer = PdfWriter()

        if args.action == "unlock":
            if reader.is_encrypted:
                # Try empty string first (for Owner locked files)
                decrypted = False
                try:
                    if reader.decrypt(""):
                        decrypted = True
                except Exception:
                    pass
                
                # If explicitly provided password
                if not decrypted and args.password:
                    try:
                        if reader.decrypt(args.password):
                            decrypted = True
                    except Exception:
                        pass
                
                if not decrypted:
                    print("ERROR: Invalid password or unsupported encryption")
                    sys.exit(1)

            # Copy all pages
            for page in reader.pages:
                writer.add_page(page)

            # Write unencrypted output
            with open(args.output, "wb") as f:
                writer.write(f)
            print("SUCCESS")

        elif args.action == "protect":
            # Copy all pages
            for page in reader.pages:
                writer.add_page(page)

            # Encrypt output
            if args.password:
                writer.encrypt(args.password)
            else:
                print("ERROR: Password empty for protection")
                sys.exit(1)

            with open(args.output, "wb") as f:
                writer.write(f)
            print("SUCCESS")

    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
