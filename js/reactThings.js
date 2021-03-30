let rc = React.createElement;
class BotInfoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bots: props.bots };
  }

  render() {
    return rc(
        React.Fragment,
        {},
      this.state.bots.map((b, key) => {
        return rc(BotInfo, { bot: b, key: key });
      })
    );

    // const bot=this.state.
  }
}

class BotInfo extends React.Component {
  render() {
    let bot = this.props.bot;
    console.log("botttt",bot);
    return rc(
      
      "tr",
      { className: "botInfo" },
      rc("th", { scope: "row" },">>"+bot.owner),
      rc("td", {}, bot.health),
      rc("td", {}, bot.maxhealth),
      rc("td", {}, bot.experience),
      rc("td", {}, bot.totalExperience)
    );
  }
}


var updateInfo = function () {
    ReactDOM.render(rc(BotInfoList,{bots:game.bots}), $("#bst")[0]);
  };

  game.config.infoUpdate=200;

game.infoLoop=setInterval(updateInfo,game.config.infoUpdate);
/*
<div>
<

</div>


*/
