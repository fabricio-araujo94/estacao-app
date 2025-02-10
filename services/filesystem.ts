import * as FileSystem from "expo-file-system";

const saveFile = async (value: string, directory: string) => {
    const path = `${FileSystem.documentDirectory}${directory}`;
    try {
      await FileSystem.writeAsStringAsync(path, value);
      console.log("Arquivo salvo!");
    } catch (error) {
      console.error("Erro ao salvar arquivo:", error);
    }
  };

  const readFile = async (directory: string): Promise<string> => {
    const path = `${FileSystem.documentDirectory}${directory}`;

    try {
      const fileInfo = await FileSystem.getInfoAsync(path);

      if (!fileInfo.exists) {
        console.log("Arquivo não encontrado. Criando...");
        await FileSystem.writeAsStringAsync(path, ""); // Cria o arquivo vazio
      }

      const content = await FileSystem.readAsStringAsync(path);

      return content;
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
      return "";
    }
  };


export { saveFile, readFile }