export class TranslateErrorFromBackend {

    static dictionary = new Map()
        .set('This record already exists', 'Данная категория уже существует');

    static getTranslatedText(errorMessage) {
        return errorMessage = this.dictionary.has(errorMessage) ? this.dictionary.get(errorMessage) : errorMessage;
    }

}