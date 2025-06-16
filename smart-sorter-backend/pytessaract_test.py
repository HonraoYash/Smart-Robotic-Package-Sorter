import pytesseract
text = pytesseract.image_to_string("delivery_package.jpeg")
print(text)
