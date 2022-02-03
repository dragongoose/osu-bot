<br/>
<p align="center">

  <h3 align="center">osu-bot</h3>

  <p align="center">
    Multi use osu! bot that allows for customizable lobbies.
    <br/>
    <br/>
    <a href="https://github.com/dragongoose/osu-bot/issues">Report Bug</a>
    .
    <a href="https://github.com/dragongoose/osu-bot/issues">Request Feature</a>
  </p>
</p>

![Forks](https://img.shields.io/github/forks/dragongoose/osu-bot) ![Stars](https://img.shields.io/github/stars/dragongoose/osu-bot) ![Issues](https://img.shields.io/github/issues/dragongoose/osu-bot) ![License](https://img.shields.io/github/license/dragongoose/osu-bot) 

## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## About The Project

Ultimately, this bot was made on a Saturday night because I was bored.

## Built With

* [bancho.js](https://github.com/ThePooN/bancho.js)

## Getting Started

To get a copy up and running follow these simple steps.
**DISCLAIMER**
Do not make a new account to run a bot.
That is considered **multiaccounting** and is banable.
Visit the [osu! wiki](https://osu.ppy.sh/wiki/en/Bot_account) for more information.

### Prerequisites

This bot uses [oppai-ng](https://github.com/Francesco149/oppai-ng) for beatmap info and pp calculation.
**WARNING**: This does mean that calculation will be slow if you have slow internet, as oppai-ng downloads the beatmap.

On windows you can download the executable file and drop it in the project's working directory.

For linux users, download the latest binaries for your OS from oppai's repository, extract the archive and place the executable in the project's working directory.

### Installation

1. Clone the repo

```sh
git clone https://github.com/dragongoose/osu-bot.git
```

2. Install NPM packages

```sh
npm install
```

3. Enter your credentials in `.env`

```JS
osuname=OSU_USERNAME
osupass=OSU_IRC_PASSWORD
apiKey=OSU_API_KEY
```

**WARNING**
The osu! password is not your account password.
You can generate a IRC password [here](https://osu.ppy.sh/p/irc)

You can get a api key [here](https://osu.ppy.sh/p/api)

## Usage

The current available commands for the bot are:
| Command| Description| 
|--------------|-----------|
| -info | Send a description of the bot and the link to this page.|
| -queue | Shows current queue for auto host rotate | 
| -start <time>| Start the round | 


## Roadmap

See the [open issues](https://github.com/dragongoose/osu-bot/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

* If you have suggestions for adding or removing projects, feel free to open an issue to discuss it, or directly create a pull request after you edit the [README.md](https://github.com/dragongoose/) file with necessary changes.
* Please make sure you check your spelling and grammar.
* Create individual PR for each suggestion.


### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licenced under the GNU General Public License V3. See [LICENSE](https://github.com/dragongoose/osu-bot/LICENSE).

## Authors

* **dragongoose** - *stacked 5 waterbottles* - [dragongoose](https://github.com/dragongoose/) - *Started the project*

## Acknowledgements

* [chalk](https://github.com/chalk/chalk)
* [dotenv](https://github.com/motdotla/dotenv)
* []()
