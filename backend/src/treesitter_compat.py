from pathlib import Path

from tree_sitter import Language
import tree_sitter_java as tsjava


def java_language() -> Language:
    cwd = Path(__file__).resolve().parent.parent.absolute()
    language_path = cwd / "lib" / "build" / "my-languages.so"
    if language_path.exists():
        return Language(str(language_path), "java")
    return Language(tsjava.language())


def set_parser_language(parser, lang) -> None:
    if hasattr(parser, "set_language"):
        parser.set_language(lang)
    else:
        parser.language = lang