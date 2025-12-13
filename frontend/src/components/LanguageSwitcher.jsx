import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, changeLanguage, LANGUAGES } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES[language];

  return (
    <div className='language-switcher' ref={dropdownRef}>
      <button
        className='language-btn'
        onClick={() => setIsOpen(!isOpen)}
        type='button'
      >
        <span className='lang-flag'>{currentLang.flag}</span>
        <span className='lang-code'>{language.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className='language-dropdown'>
          {Object.values(LANGUAGES).map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${
                language === lang.code ? 'active' : ''
              }`}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
            >
              <span className='lang-flag'>{lang.flag}</span>
              <span className='lang-name'>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
