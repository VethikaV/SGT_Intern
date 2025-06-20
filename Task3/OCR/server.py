import os
from flask import Flask, request, jsonify, render_template
from PIL import Image
import pytesseract
from deep_translator import GoogleTranslator
from langdetect import detect, DetectorFactory
import io

app = Flask(__name__)

# Set seed for consistent language detection
DetectorFactory.seed = 0

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Supported languages for GoogleTranslator (from error message)
SUPPORTED_LANGUAGE_CODES = {
    'af': 'Afrikaans', 'sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic', 'hy': 'Armenian',
    'as': 'Assamese', 'ay': 'Aymara', 'az': 'Azerbaijani', 'bm': 'Bambara', 'eu': 'Basque',
    'be': 'Belarusian', 'bn': 'Bengali', 'bho': 'Bhojpuri', 'bs': 'Bosnian', 'bg': 'Bulgarian',
    'ca': 'Catalan', 'ceb': 'Cebuano', 'ny': 'Chichewa', 'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)', 'co': 'Corsican', 'hr': 'Croatian', 'cs': 'Czech',
    'da': 'Danish', 'dv': 'Dhivehi', 'doi': 'Dogri', 'nl': 'Dutch', 'en': 'English',
    'eo': 'Esperanto', 'et': 'Estonian', 'ee': 'Ewe', 'tl': 'Filipino', 'fi': 'Finnish',
    'fr': 'French', 'fy': 'Frisian', 'gl': 'Galician', 'ka': 'Georgian', 'de': 'German',
    'el': 'Greek', 'gn': 'Guarani', 'gu': 'Gujarati', 'ht': 'Haitian Creole', 'ha': 'Hausa',
    'haw': 'Hawaiian', 'iw': 'Hebrew', 'hi': 'Hindi', 'hmn': 'Hmong', 'hu': 'Hungarian',
    'is': 'Icelandic', 'ig': 'Igbo', 'ilo': 'Ilocano', 'id': 'Indonesian', 'ga': 'Irish',
    'it': 'Italian', 'ja': 'Japanese', 'jw': 'Javanese', 'kn': 'Kannada', 'kk': 'Kazakh',
    'km': 'Khmer', 'rw': 'Kinyarwanda', 'gom': 'Konkani', 'ko': 'Korean', 'kri': 'Krio',
    'ku': 'Kurdish (Kurmanji)', 'ckb': 'Kurdish (Sorani)', 'ky': 'Kyrgyz', 'lo': 'Lao',
    'la': 'Latin', 'lv': 'Latvian', 'ln': 'Lingala', 'lt': 'Lithuanian', 'lg': 'Luganda',
    'lb': 'Luxembourgish', 'mk': 'Macedonian', 'mai': 'Maithili', 'mg': 'Malagasy',
    'ms': 'Malay', 'ml': 'Malayalam', 'mt': 'Maltese', 'mi': 'Maori', 'mr': 'Marathi',
    'mni-mtei': 'Meiteilon (Manipuri)', 'lus': 'Mizo', 'mn': 'Mongolian', 'my': 'Myanmar',
    'ne': 'Nepali', 'no': 'Norwegian', 'or': 'Odia (Oriya)', 'om': 'Oromo', 'ps': 'Pashto',
    'fa': 'Persian', 'pl': 'Polish', 'pt': 'Portuguese', 'pa': 'Punjabi', 'qu': 'Quechua',
    'ro': 'Romanian', 'ru': 'Russian', 'sm': 'Samoan', 'sa': 'Sanskrit', 'gd': 'Scots Gaelic',
    'nso': 'Sepedi', 'sr': 'Serbian', 'st': 'Sesotho', 'sn': 'Shona', 'sd': 'Sindhi',
    'si': 'Sinhala', 'sk': 'Slovak', 'sl': 'Slovenian', 'so': 'Somali', 'es': 'Spanish',
    'su': 'Sundanese', 'sw': 'Swahili', 'sv': 'Swedish', 'tg': 'Tajik', 'ta': 'Tamil',
    'tt': 'Tatar', 'te': 'Telugu', 'th': 'Thai', 'ti': 'Tigrinya', 'ts': 'Tsonga',
    'tr': 'Turkish', 'tk': 'Turkmen', 'ak': 'Twi', 'uk': 'Ukrainian', 'ur': 'Urdu',
    'ug': 'Uyghur', 'uz': 'Uzbek', 'vi': 'Vietnamese', 'cy': 'Welsh', 'xh': 'Xhosa',
    'yi': 'Yiddish', 'yo': 'Yoruba', 'zu': 'Zulu'
}

# OCR language codes for Tesseract
OCR_LANGUAGES = {
    'af': 'afr', 'am': 'amh', 'ar': 'ara', 'as': 'asm', 'az': 'aze', 'be': 'bel',
    'bn': 'ben', 'bo': 'bod', 'bs': 'bos', 'bg': 'bul', 'ca': 'cat', 'ceb': 'ceb',
    'cs': 'ces', 'zh-cn': 'chi_sim', 'zh-tw': 'chi_tra', 'zh': 'chi_sim', 'co': 'cos',
    'cy': 'cym', 'da': 'dan', 'de': 'deu', 'dz': 'dzo', 'el': 'ell', 'en': 'eng',
    'eo': 'epo', 'et': 'est', 'eu': 'eus', 'fa': 'fas', 'fi': 'fin', 'fr': 'fra',
    'fy': 'fry', 'ga': 'gle', 'gd': 'gla', 'gl': 'glg', 'gu': 'guj', 'hat': 'hat',
    'he': 'heb', 'hi': 'hin', 'hr': 'hrv', 'hu': 'hun', 'hy': 'hye', 'id': 'ind',
    'is': 'isl', 'it': 'ita', 'iu': 'iku', 'ja': 'jpn', 'jv': 'jav', 'ka': 'kat',
    'kk': 'kaz', 'km': 'khm', 'ky': 'kir', 'ko': 'kor', 'ku': 'kur', 'ky': 'kir',
    'la': 'lat', 'lb': 'ltz', 'lo': 'lao', 'lt': 'lit', 'lv': 'lav', 'mg': 'mlg',
    'mi': 'mri', 'mk': 'mkd', 'ml': 'mal', 'mn': 'mon', 'mr': 'mar', 'ms': 'msa',
    'mt': 'mlt', 'my': 'mya', 'ne': 'nep', 'nl': 'nld', 'no': 'nor', 'oc': 'oci',
    'or': 'ori', 'pa': 'pan', 'pl': 'pol', 'ps': 'pus', 'pt': 'por', 'qu': 'que',
    'ro': 'ron', 'ru': 'rus', 'sa': 'san', 'si': 'sin', 'sk': 'slk', 'sl': 'slv',
    'sn': 'sna', 'so': 'som', 'sq': 'sqi', 'sr': 'srp', 'su': 'sun', 'sv': 'swe',
    'sw': 'swa', 'ta': 'tam', 'te': 'tel', 'tg': 'tgk', 'th': 'tha', 'ti': 'tir',
    'tk': 'tuk', 'tl': 'tgl', 'tr': 'tur', 'tt': 'tat', 'ug': 'uig', 'uk': 'ukr',
    'ur': 'urd', 'uz': 'uzb', 'vi': 'vie', 'yi': 'yid', 'yo': 'yor'
}

def detect_language(text):
    """Detect the language of the given text"""
    try:
        detected_lang = detect(text)
        return detected_lang, SUPPORTED_LANGUAGE_CODES.get(detected_lang, 'Unknown')
    except:
        return 'unknown', 'Unknown'

def get_supported_languages():
    """Get all supported languages for translation"""
    return SUPPORTED_LANGUAGE_CODES

def get_ocr_languages():
    """Get all supported OCR languages"""
    return OCR_LANGUAGES

@app.route('/')
def index():
    languages = get_supported_languages()
    ocr_languages = get_ocr_languages()
    return render_template('index.html', languages=languages, ocr_languages=ocr_languages)

@app.route('/api/languages')
def api_languages():
    """API endpoint to get all supported languages"""
    return jsonify({
        'translation_languages': get_supported_languages(),
        'ocr_languages': get_ocr_languages(),
        'total_translation_languages': len(get_supported_languages()),
        'total_ocr_languages': len(get_ocr_languages())
    })

@app.route('/process', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    target_language = request.form.get('target_language', 'en')
    ocr_language = request.form.get('ocr_language', 'auto')
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Validate target_language
    if target_language not in SUPPORTED_LANGUAGE_CODES and target_language != 'auto':
        return jsonify({
            'error': f'Target language {target_language} not supported',
            'supported_languages': SUPPORTED_LANGUAGE_CODES
        }), 400
    
    # Save and process image
    image_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(image_path)
    
    try:
        # Open and process image
        image = Image.open(image_path)
        
        # Determine OCR language
        if ocr_language == 'auto':
            ocr_lang_code = 'eng+ara+chi_sim+chi_tra+jpn+kor+hin+ben+tam+tel+mal+mar+guj+pan+urd+tha+vie+rus+spa+fra+deu+ita+por+nld+pol+ukr+ces+hun+ron+hrv+bul+slk+fin+dan+swe+nor+isl+est+lav+lit+slv+mkd+bos+srp+mlt+tur+ell+heb+fas+aze+uzb+kaz+kir+mon+tat+uig+tgk+sin+mya+khm+lao+kat+hye+amh+tir+orm+som+swa+mlg+afr+nld+eus+cat+glg+cym+gle+gla+bre+cor+mri+hat+que+grn+nav'
        else:
            ocr_lang_code = OCR_LANGUAGES.get(ocr_language, 'eng')
        
        # Perform OCR with specified language
        try:
            extracted_text = pytesseract.image_to_string(image, lang=ocr_lang_code, config='--psm 6')
        except Exception as ocr_error:
            try:
                # Fallback to basic multilingual
                extracted_text = pytesseract.image_to_string(image, lang='eng+ara+chi_sim+hin+spa+fra')
            except:
                # Final fallback to English only
                extracted_text = pytesseract.image_to_string(image, lang='eng')
        
        if not extracted_text.strip():
            return jsonify({
                'extracted_text': 'No text detected',
                'translated_text': 'No text to translate',
                'detected_language': 'unknown',
                'detected_language_name': 'Unknown',
                'target_language': target_language,
                'target_language_name': SUPPORTED_LANGUAGE_CODES.get(target_language, 'Unknown'),
                'ocr_language_used': ocr_lang_code
            })
        
        # Detect language of extracted text
        detected_lang_code, detected_lang_name = detect_language(extracted_text)
        
        # Validate detected language
        if detected_lang_code not in SUPPORTED_LANGUAGE_CODES:
            detected_lang_code = 'en'  # Fallback to English
            detected_lang_name = 'English'
        
        # Translate text if target language is different from detected language
        translated_text = extracted_text
        translation_status = 'no_translation_needed'
        
        if detected_lang_code != target_language and target_language != 'auto':
            try:
                translator = GoogleTranslator(source=detected_lang_code, target=target_language)
                translated_text = translator.translate(extracted_text)
                if not translated_text:
                    translated_text = 'Translation failed - service unavailable'
                    translation_status = 'failed'
                else:
                    translation_status = 'success'
            except Exception as e:
                translated_text = f'Translation error: {str(e)}'
                translation_status = 'error'
        elif target_language == 'auto':
            translated_text = 'Auto mode - no translation performed'
            translation_status = 'auto_mode'
        
        return jsonify({
            'extracted_text': extracted_text.strip(),
            'translated_text': translated_text,
            'detected_language': detected_lang_code,
            'detected_language_name': detected_lang_name,
            'target_language': target_language,
            'target_language_name': SUPPORTED_LANGUAGE_CODES.get(target_language, 'Unknown'),
            'ocr_language_used': ocr_lang_code,
            'translation_status': translation_status,
            'confidence': 'high' if len(extracted_text.strip()) > 20 else 'medium' if len(extracted_text.strip()) > 5 else 'low',
            'text_length': len(extracted_text.strip()),
            'supported_languages_count': len(SUPPORTED_LANGUAGE_CODES)
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500
    
    finally:
        # Clean up uploaded file
        if os.path.exists(image_path):
            os.remove(image_path)

@app.route('/detect-language', methods=['POST'])
def detect_text_language():
    """Endpoint to detect language of provided text"""
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    if not text.strip():
        return jsonify({'error': 'Empty text provided'}), 400
    
    detected_lang_code, detected_lang_name = detect_language(text)
    
    return jsonify({
        'detected_language': detected_lang_code,
        'detected_language_name': detected_lang_name,
        'text_length': len(text),
        'confidence': 'high' if len(text.strip()) > 20 else 'medium' if len(text.strip()) > 5 else 'low',
        'supported_languages_count': len(SUPPORTED_LANGUAGE_CODES)
    })

@app.route('/translate-text', methods=['POST'])
def translate_text():
    """Endpoint to translate text directly"""
    data = request.get_json()
    if not data or 'text' not in data or 'target_language' not in data:
        return jsonify({'error': 'Text and target_language are required'}), 400
    
    text = data['text']
    target_language = data['target_language']
    source_language = data.get('source_language', 'auto')
    
    if not text.strip():
        return jsonify({'error': 'Empty text provided'}), 400
    
    # Validate target_language
    if target_language not in SUPPORTED_LANGUAGE_CODES:
        return jsonify({
            'error': f'Target language {target_language} not supported',
            'supported_languages': SUPPORTED_LANGUAGE_CODES
        }), 400
    
    try:
        # Detect source language if auto
        if source_language == 'auto':
            source_language, _ = detect_language(text)
        
        # Validate source_language
        if source_language != 'auto' and source_language not in SUPPORTED_LANGUAGE_CODES:
            return jsonify({
                'error': f'Source language {source_language} not supported',
                'supported_languages': SUPPORTED_LANGUAGE_CODES
            }), 400
        
        # Skip translation if source and target are the same
        if source_language == target_language:
            return jsonify({
                'original_text': text,
                'translated_text': text,
                'source_language': source_language,
                'target_language': target_language,
                'message': 'Source and target languages are the same'
            })
        
        # Perform translation
        translator = GoogleTranslator(source=source_language, target=target_language)
        translated_text = translator.translate(text)
        
        return jsonify({
            'original_text': text,
            'translated_text': translated_text or 'Translation failed',
            'source_language': source_language,
            'source_language_name': SUPPORTED_LANGUAGE_CODES.get(source_language, 'Unknown'),
            'target_language': target_language,
            'target_language_name': SUPPORTED_LANGUAGE_CODES.get(target_language, 'Unknown')
        })
        
    except Exception as e:
        return jsonify({'error': f'Translation error: {str(e)}'}), 500

@app.route('/batch-translate', methods=['POST'])
def batch_translate():
    """Endpoint to translate multiple texts to multiple languages"""
    data = request.get_json()
    if not data or 'texts' not in data or 'target_languages' not in data:
        return jsonify({'error': 'texts and target_languages arrays are required'}), 400
    
    texts = data['texts']
    target_languages = data['target_languages']
    source_language = data.get('source_language', 'auto')
    
    if not texts or not target_languages:
        return jsonify({'error': 'Empty texts or target_languages provided'}), 400
    
    # Validate target_languages
    invalid_langs = [lang for lang in target_languages if lang not in SUPPORTED_LANGUAGE_CODES]
    if invalid_langs:
        return jsonify({
            'error': f'Invalid target languages: {invalid_langs}',
            'supported_languages': SUPPORTED_LANGUAGE_CODES
        }), 400
    
    # Validate source_language if not auto
    if source_language != 'auto' and source_language not in SUPPORTED_LANGUAGE_CODES:
        return jsonify({
            'error': f'Source language {source_language} not supported',
            'supported_languages': SUPPORTED_LANGUAGE_CODES
        }), 400
    
    results = []
    
    for text in texts:
        if not text.strip():
            continue
            
        text_results = {'original_text': text, 'translations': {}}
        
        # Detect source language if auto
        if source_language == 'auto':
            detected_lang, _ = detect_language(text)
        else:
            detected_lang = source_language
        
        # Fallback to English if detected language is not supported
        if detected_lang not in SUPPORTED_LANGUAGE_CODES:
            detected_lang = 'en'
        
        text_results['detected_language'] = detected_lang
        text_results['detected_language_name'] = SUPPORTED_LANGUAGE_CODES.get(detected_lang, 'Unknown')
        
        # Translate to each target language
        for target_lang in target_languages:
            if detected_lang == target_lang:
                text_results['translations'][target_lang] = {
                    'text': text,
                    'status': 'no_translation_needed',
                    'target_language_name': SUPPORTED_LANGUAGE_CODES.get(target_lang, 'Unknown')
                }
                continue
                
            try:
                translator = GoogleTranslator(source=detected_lang, target=target_lang)
                translated = translator.translate(text)
                text_results['translations'][target_lang] = {
                    'text': translated or 'Translation failed',
                    'status': 'success' if translated else 'failed',
                    'target_language_name': SUPPORTED_LANGUAGE_CODES.get(target_lang, 'Unknown')
                }
            except Exception as e:
                text_results['translations'][target_lang] = {
                    'text': f'Error: {str(e)}',
                    'status': 'error',
                    'target_language_name': SUPPORTED_LANGUAGE_CODES.get(target_lang, 'Unknown')
                }
        
        results.append(text_results)
    
    return jsonify({
        'results': results,
        'total_texts': len(texts),
        'total_target_languages': len(target_languages),
        'supported_languages_count': len(SUPPORTED_LANGUAGE_CODES)
    })

@app.route('/language-stats', methods=['GET'])
def get_language_stats():
    """Get comprehensive language support statistics"""
    indian_languages = {
        k: v for k, v in SUPPORTED_LANGUAGE_CODES.items() 
        if v in ['Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Malayalam', 'Gujarati', 
                'Kannada', 'Punjabi', 'Assamese', 'Odia (Oriya)', 'Sanskrit', 'Bhojpuri', 
                'Dogri', 'Maithili', 'Konkani']
    }
    
    chinese_variants = {
        k: v for k, v in SUPPORTED_LANGUAGE_CODES.items() 
        if 'Chinese' in v or k in ['zh-cn', 'zh-tw']
    }
    
    european_languages = {
        k: v for k, v in SUPPORTED_LANGUAGE_CODES.items() 
        if v in ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
                'Dutch', 'Polish', 'Romanian', 'Greek', 'Czech', 'Hungarian', 'Swedish',
                'Danish', 'Norwegian', 'Finnish', 'Bulgarian', 'Croatian', 'Slovak',
                'Slovenian', 'Estonian', 'Latvian', 'Lithuanian', 'Ukrainian', 'Serbian',
                'Bosnian', 'Macedonian', 'Albanian', 'Irish', 'Welsh', 'Basque', 'Catalan']
    }
    
    african_languages = {
        k: v for k, v in SUPPORTED_LANGUAGE_CODES.items() 
        if v in ['Swahili', 'Hausa', 'Yoruba', 'Igbo', 'Zulu', 'Xhosa', 'Afrikaans', 
                'Amharic', 'Somali', 'Oromo', 'Shona', 'Sesotho', 'Chichewa']
    }
    
    return jsonify({
        'total_languages': len(SUPPORTED_LANGUAGE_CODES),
        'total_ocr_languages': len(OCR_LANGUAGES),
        'indian_languages': {
            'count': len(indian_languages),
            'languages': indian_languages
        },
        'chinese_variants': {
            'count': len(chinese_variants),
            'languages': chinese_variants
        },
        'european_languages': {
            'count': len(european_languages),
            'languages': european_languages
        },
        'african_languages': {
            'count': len(african_languages),
            'languages': african_languages
        },
        'major_language_families': {
            'Indo-European': len([l for l in SUPPORTED_LANGUAGE_CODES.values() if l in european_languages.values() or l in indian_languages.values()]),
            'Sino-Tibetan': len(chinese_variants),
            'Afro-Asiatic': len([l for l in SUPPORTED_LANGUAGE_CODES.values() if l in ['Arabic', 'Amharic']]),
            'Niger-Congo': len(african_languages)
        }
    })

if __name__ == '__main__':
    print(f"Starting OCR & Translation Server...")
    print(f"Supported Translation Languages: {len(SUPPORTED_LANGUAGE_CODES)}")
    print(f"Supported OCR Languages: {len(OCR_LANGUAGES)}")
    print(f"Indian Languages: {len([l for l in SUPPORTED_LANGUAGE_CODES.values() if l in ['Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Malayalam', 'Gujarati', 'Kannada', 'Punjabi', 'Assamese', 'Odia (Oriya)', 'Sanskrit', 'Bhojpuri', 'Dogri', 'Maithili', 'Konkani']])}")
    app.run(debug=True, host='0.0.0.0', port=5000)