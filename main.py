import re
from flask import Flask, render_template, request, jsonify
import config

app = Flask(__name__)
app.config.from_object(config.conf)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/word_count', methods=['POST'])
def word_count():
    """Counting words method"""
    data = request.get_json()
    text = data.get('text', '')
    count = get_word_count(text)
    return jsonify({'count': count})

def get_word_count(text):
    """Method for counting words when English and Chinese / Japanese mixed"""
    en_words = re.findall(r'[a-zA-Z]+(?:\'[a-z]+)?', text)
    non_en_chars = re.findall(r'[^\x00-\x7F]', text)

    english_word_count = len(en_words)
    non_english_char_count = len(non_en_chars)

    return english_word_count + non_english_char_count

if __name__ == '__main__':
    app.run(debug=True)