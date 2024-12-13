import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import LatestMatch from '../LatestMatch'
import PieChart from '../PieChart'
import MatchCard from '../MatchCard'

import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamMatchesData: {},
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getFormattedData = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const fetchedData = await response.json()
    const formattedData = {
      teamBannerURL: fetchedData.team_banner_url,
      latestMatch: this.getFormattedData(fetchedData.latest_match_details),
      recentMatches: fetchedData.recent_matches.map(each =>
        this.getFormattedData(each),
      ),
    }
    const wonMatches = formattedData.recentMatches.filter(
      wonMatch => wonMatch.matchStatus === 'Won',
    ).length
    const lostMatches = formattedData.recentMatches.filter(
      lostMatch => lostMatch.matchStatus === 'Lost',
    ).length
    const drawnMatches = formattedData.recentMatches.filter(
      drawnMatch => drawnMatch.matchStatus === 'Drawn',
    ).length

    const matchStatistics = [
      {name: 'Won', value: wonMatches},
      {name: 'Lost', value: lostMatches},
      {name: 'Drawn', value: drawnMatches},
    ]

    this.setState({
      teamMatchesData: {...formattedData, matchStatistics},
      isLoading: false,
    })
  }

  renderRecentMatchesList = () => {
    const {teamMatchesData} = this.state
    const {recentMatches} = teamMatchesData

    return (
      <>
        <ul className="recent-matches-list">
          {recentMatches.map(recentMatch => (
            <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
          ))}
        </ul>
        <div className="back-button">
          <Link to="/">
            <button className="back" type="button">
              Back
            </button>
          </Link>
        </div>
      </>
    )
  }

  renderTeamMatches = () => {
    const {teamMatchesData} = this.state
    const {teamBannerURL, latestMatch, matchStatistics} = teamMatchesData

    return (
      <div className="responsive-container">
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <h2 className="stats-heading">Match Statistics</h2>
        <PieChart data={matchStatistics} />
        <LatestMatch latestMatchData={latestMatch} />
        {this.renderRecentMatchesList()}
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )

  getRouteClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state
    const className = `team-matches-container ${this.getRouteClassName()}`

    return (
      <div className={className}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
