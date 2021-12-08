'use strict';

const fs = require(`fs`).promises;
const moment = require(`moment`);
const path = require(`path`);
const chalk = require(`chalk`);
const {ExitCode} = require(`../constants`);
const {categories, titles, descriptions} = require(`./data`);
const {getRandomInt, shuffle, formatDate} = require(`../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;

const generateOffers = async (count) => {
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(descriptions).slice(0, getRandomInt(1, 5)).join(` `),
    fullText: shuffle(descriptions).slice(0, getRandomInt(5, descriptions.length - 1)).join(` `),
    createdDate: formatDate(moment().subtract(getRandomInt(0, 90), `days`)),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
  }));
};

const saveOffers = async (data) => {
  const rootFolder = path.resolve(`./`, FILE_NAME);

  try {
    await fs.writeFile(rootFolder, JSON.stringify(data));
    console.log(chalk.green(`Operation success. File created.`));
  } catch (err) {
    console.error(chalk.red(`Can't write data to file...`));
    console.info(chalk.blue(`Error details:\n`), err);
    process.exit(ExitCode.error);
  }
};

module.exports = {
  name: `--generate`,
  async run(count) {
    const offersCount = Number(count) || DEFAULT_COUNT;

    if (offersCount > MAX_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      return;
    }

    const offers = await generateOffers(offersCount);
    await saveOffers(offers);
  }
};
