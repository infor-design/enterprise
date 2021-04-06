# Notes on Getting Translations and Localization

## Translations Summary

To add a new translation string and use it in the code add it in the en-US.js

- Keep the alphabetic Order
- Add a comment to explain to the translator where and how this is used for context.
- You can also add an es-ES translated by google for testing the locales. This will be replaced when it comes back.

All the stuff in the messages section comes from the internal Translation Team. If they don't support a locale you could also let an external team fill in. We send these once a month.

- We use the en-US.js as the source in <http://git.infor.com/projects/SOHO/repos/controls/browse/components/locale/cultures>
- We copy that to `\\nlbavwmemq1\cc\FromDev\SohoUX\`
- Arrange timing with the translation team
- When it comes back it comes in `\\nlbavwmemq1\cc\ToDev\SohoUX\`
- We have to manually copy and paste the sections in the rest of the files in`src/components/locale/cultures/` as parts of the files are different except the messages section

When you get the file back.

- Copy the messages section of each file into the respective file
- Add a \ in front of ' in the file. This happens on af, fr and ru and uk locales, but can be tested by running `npm run lint:ci`
- Ensure the spacing is kept in tact.
- Some locales like en, es and no are shared between similar locales (i.e. only one translation for es is given)
- zh-TW and  zh-Hant are copies of each other so copy zh-TW to both and change the names
- zh-CN and  zh-Hans are copies of each other so copy zh-TW to both and change the names

## Dates and numbers

All the date and number info in each file comes from or is derived from the <http://cldr.unicode.org/>.
There is a JSON download with the info. Use the en-US.js main file for organization and copy the stuff for each locale.
