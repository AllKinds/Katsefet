/**
 * Helper functions for the tests
 */
import { IUser } from '../user/user.interface';
import { userModel } from '../user/user.model';
import { fileModel } from '../file/file.model';
import * as fs from 'fs-extra';
import { config } from '../config';

export function createJsonUsers(numUsers: number): IUser[] {
  const testUsers: IUser[] = [];
  for (let i: number = 0; i < numUsers; i++) {
    const user: any = {
      _id: 'ID' + i,
      uniqueID: 'uID' + i,
      creationDate: new Date(),
      hierarchy: 'Aman/Sapir/MadorHaim/' + i,
      name: 'User' + i,
      rootFolder: '/Path/To/Root/Folder' + i
    };
    testUsers.push(user);
  }

  return testUsers;
}

// Create Random users using random strings
export function createUsers(numUsers: number): IUser[] {
  const rand1: string = Math.random().toString(36).substring(2, 7);
  const rand2: string = Math.random().toString(36).substring(2, 7);
  const testUsers: IUser[] = [];
  for (let i: number = 0; i < numUsers; i++) {
    const user: IUser = new userModel({
      _id: rand1 + '_' + (numUsers * 10 + i),
      uniqueID: rand2 + '_' + (numUsers * 10 + i),
      creationDate: new Date(),
      hierarchy: 'Aman/Sapir/MadorHaim/' + i,
      name: 'User' + i,
      rootFolder: '/Path/To/Root/Folder' + i
    });
    testUsers.push(user);
  }

  return testUsers;
}

export function createFiles(numFiles: number) {
  fs.ensureDir(`${config.storage}`, (err) => {
    if (err) throw err;
  });
  const testFiles = [];
  for (let i = 0; i < numFiles; i = i + 1) {
    const currName = 'test-' + i + '.txt';
    const file = new fileModel({
      fileName: currName,
      fileSize: 10 * i,
      path: 'uploadsTEST\\' + currName,
      fileType: 'txt',
      createdAt: Date.now(),
      Owner: 'Owner',
      Parent: 'Parent',
    });
    testFiles.push(file);
    createFile(file.fileName);
  }
  return testFiles;
}

function createFile(fileName: string) {
  // Change the content of the file as you want
  const fileContent = 'Hello World!';

  // The absolute path of the new file with its name
  const filepath = 'uploadsTEST/' + fileName;

  fs.writeFile(filepath, fileContent, (err) => {
    if (err) throw err;
    // console.log('The file was succesfully saved!');
  });
}

async function createFolder(directory) {
  try {
    await fs.ensureDir(directory);
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}
