import axios from "axios";
import { parseStringPromise } from "xml2js";

export async function getImagesFromPage(category: string, page: number) {
  const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${category}&pid=${page}&api_key=${process.env.API_KEY}&user_id=${process.env.USER_ID}`;
  console.log(`Get page. Request to ${url}`);

  const { data } = await axios.get(url);
  const xml = await parseStringPromise(data);

  return xml;
}

export async function getPagesCount(category: string) {
  const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${category}&pid=0&limit=0&api_key=${process.env.API_KEY}&user_id=${process.env.USER_ID}`;
  console.log(`Get categories count for ${category}. Request to ${url}`);

  const { data } = await axios.get(url);
  const xml = await parseStringPromise(data);

  const pagesCount = Math.ceil(xml.posts["$"].count / 100);
  console.log(`Pages count for '${category}': ${pagesCount}`);

  return pagesCount;
}
