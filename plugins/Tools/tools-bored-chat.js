import axios from "axios";
import { FormData } from "formdata-node";
const celebrityOptions = ["Homer Simpson from The Simpsons", "The Rock (Dwayne Johnson)", "Joe Rogan from The Joe Rogan Experience", "Darth Vader from Star Wars", "The rapper Snoop Dogg", "radio host Howard Stern", "Tony Stark (Iron Man)", "Peter Griffin from Family Guy", "Elon Musk ", "Spongebob Squarepants", "Sherlock Holmes", "Batman", "Jimmy Fallon", "Socrates", "Santa Claus"],
  postData = async (index, input) => {
    try {
      const selectedCelebrity = celebrityOptions[index],
        formData = new FormData;
      formData.append("message", input), formData.append("intro", selectedCelebrity),
        formData.append("name", selectedCelebrity);
      return (await axios.post("https://boredhumans.com/api_celeb_chat.php", formData)).data;
    } catch (error) {
      throw console.error("Error:", error), error;
    }
  }, handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, command: command }) => {
    try {
      let text;
      if (args.length >= 1) text = args.slice(0).join(" ");
      else {
        if (!m.quoted || !m.quoted?.text) {
          console.log("Select a celebrity by entering the corresponding number:");
          const listMessage = `Select a celebrity:\n${celebrityOptions.map(((celebrity, index) => `${index + 1}. ${celebrity}`)).join("\n")}`;
          return void m.reply(listMessage);
        }
        text = m.quoted?.text;
      }
      m.react(wait);
      const inputArray = text.split("|");
      if (2 !== inputArray.length) {
        const errorMessage = 'Invalid input format. Please use "index|input".';
        m.reply(errorMessage);
        const helpMessage = "Please use the format: index|input. For example: 3|Hello";
        m.reply(helpMessage);
      } else {
        const selectedIndex = parseInt(inputArray[0]),
          userInput = inputArray[1];
        if (!isNaN(selectedIndex) && selectedIndex >= 1 && selectedIndex <= celebrityOptions.length) {
          const result = await postData(selectedIndex - 1, userInput);
          m.reply(result.output);
        } else {
          const errorMessage = "Invalid selection. Please enter a valid number.";
          m.reply(errorMessage);
          const helpMessage = "Please use the format: index|input. For example: 3|Hello";
          m.reply(helpMessage);
        }
      }
    } catch (error) {
      console.error("Error in main code:", error), m.reply(`Error: ${error}`);
    }
  };
handler.help = ["boredchat"], handler.tags = ["tools"], handler.command = /^(boredchat)$/i;
export default handler;