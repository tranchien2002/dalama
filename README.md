<h1 align="center">Welcome to Dalama 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
</p>

### ✨ [Demo](https://dalama-sun.firebaseapp.com/)

### Description

For a researcher who needs data sets to train their model, they will publish the raw data sets that need labeling. These datasets will be stored on ocean.

For most ordinary users who want to label the data, they can retrieve the published raw data sheets via the ocean protocol. They will label the data and upload it again with the corresponding price for the cleaned data set. Before uploading labeled data to the ocean, this dataset will be randomly taken in part to create a preview for those who want to purchase the cleaned data set so they can evaluate it before spending money to buy a complete data set.

In this version, the application was restricted to labeling by only accepting jpeg, png and txt file types. The random demo builder has only received the zip file, it's similar to the demo we introduced in the attached video. In the next versions we will upgrade the file type as well as more convenient file structure to uploading for the data entry

## Install + Config

### Install dependencies

```sh
cd client
npm install
```

### Config firebase

Firstly, you need add a new project in here: https://console.firebase.google.com/u/0/

- Create real time database
- Add firebase to web app to get Firebase SDK
- Add Firebase SDK to .env (The configuaration same like .env.example file)

## Usage

```sh
npm run start
```

## Build

```sh
npm run build
```

👤 **Sun\***

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
