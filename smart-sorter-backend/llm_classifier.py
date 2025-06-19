from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')
CATEGORIES = ["fragile", "urgent", "heavy"]

def classify_semantically(labels: list[str]) -> str:
    label_text = ", ".join(labels)

    # Embed the labels and categories
    emb_label = model.encode(label_text, convert_to_tensor=True)
    emb_cats = model.encode(CATEGORIES, convert_to_tensor=True)

    # Compute cosine similarity
    similarities = util.cos_sim(emb_label, emb_cats)[0]
    best_idx = similarities.argmax().item()

    return CATEGORIES[best_idx]
