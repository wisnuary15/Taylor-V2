import axios from 'axios';
import {
  FormData
} from 'formdata-node';
const celebrityOptions = ['Homer Simpson from The Simpsons', 'The Rock (Dwayne Johnson)',
  'Joe Rogan from The Joe Rogan Experience', 'Darth Vader from Star Wars', 'The rapper Snoop Dogg',
  'radio host Howard Stern', 'Tony Stark (Iron Man)', 'Peter Griffin from Family Guy', 'Elon Musk ',
  'Spongebob Squarepants', 'Sherlock Holmes', 'Batman', 'Jimmy Fallon', 'Socrates', 'Santa Claus'
];
const postData = async (index, input) => {
  try {
    const selectedCelebrity = celebrityOptions[index];
    const formData = new FormData();
    formData.append('message', input);
    formData.append('intro', selectedCelebrity);
    formData.append('name', selectedCelebrity);
    const response2 = await axios.post('https://boredhumans.com/api_celeb_chat.php', formData);
    return response2.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  try {
    let text;
    if (args.length >= 1) {
      text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted?.text) {
      text = m.quoted?.text;
    } else {
      console.log('Select a celebrity by entering the corresponding number:');
      const celebrityList = celebrityOptions.map((celebrity, index) => `${index + 1}. ${celebrity}`);
      const listMessage = `Select a celebrity:\n${celebrityList.join('\n')}`;
      m.reply(listMessage);
      return;
    }
    m.react(wait);
    const inputArray = text.split('|');
    if (inputArray.length !== 2) {
      const errorMessage = 'Invalid input format. Please use "index|input".';
      m.reply(errorMessage);
      const helpMessage = 'Please use the format: index|input. For example: 3|Hello';
      m.reply(helpMessage);
    } else {
      const selectedIndex = parseInt(inputArray[0]);
      const userInput = inputArray[1];
      if (!isNaN(selectedIndex) && selectedIndex >= 1 && selectedIndex <= celebrityOptions.length) {
        const result = await postData(selectedIndex - 1, userInput);
        m.reply(result.output);
      } else {
        const errorMessage = 'Invalid selection. Please enter a valid number.';
        m.reply(errorMessage);
        const helpMessage = 'Please use the format: index|input. For example: 3|Hello';
        m.reply(helpMessage);
      }
    }
  } catch (error) {
    console.error('Error in main code:', error);
    m.reply(`Error: ${error}`);
  }
};
handler.help = ["boredchat"];
handler.tags = ["tools"];
handler.command = /^(boredchat)$/i;
export default handler;
