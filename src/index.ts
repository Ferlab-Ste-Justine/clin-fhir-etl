import { GoogleSheetLoader } from "./GoogleSheetLoader";
import { Network } from "./Network";


const start = async () => {
	const data = await GoogleSheetLoader.load();
	const network = new Network(data);
	network.upload();
}


start();