import React, {useEffect} from 'react'
import {Col, Container, Image, Row} from 'react-bootstrap'
import PortfolioCard from './PortfolioCard'
import {exactNumberFormate, numberFormate} from '../../Utilities/Util'
import {useHistory} from 'react-router-dom'
import ReactLoading from 'react-loading'

// Svgs
import card_one from '../../Assets/portfolio/card_one.svg'
import card_two from '../../Assets/portfolio/card_two.svg'
import card_three from '../../Assets/portfolio/card_three.svg'
import card_four from '../../Assets/portfolio/card_four.svg'
import card_five from '../../Assets/portfolio/card_five.svg'
import Logo from '../../Assets/CC_Logo.svg'

// Redux Imports
import {useDispatch, useSelector} from 'react-redux'
import {
  disConnectWallet,
  getProfileInformation,
  getProfileInformationTest,
} from '../../Redux/Profile/actions'
import NumberFormat from 'react-number-format'

const MyPortfolio = () => {
  // Redux State
  const dispatch = useDispatch()
  const {
    userAddress,
    availableBalance,
    CAPLBalance,
    CRETBalance,
    CCPTBalance,
    totalRewards,
    lpCAPLBalance,
    lpCRETBalance,
  } = useSelector((state) => state.profile)
  let history = useHistory()
  const {
    lpCRETBalance: a,
    lpCAPLBalance: b,
    testUSDC: c,
  } = useSelector((state) => state.testProfile)
  const {apy, withdrawLpBalance, vaultRewards} = useSelector(
    (state) => state.vault
  )
  const {ccptBNBBalance, balanceLoading} = useSelector((state) => state.swap)
  useEffect(() => {
    if (userAddress) {
      dispatch(getProfileInformation())
      dispatch(getProfileInformationTest())
    }
  }, [userAddress])

  const handleDisconnect = () => {
    dispatch(disConnectWallet())
  }
  return (
    <div className='portfolio'>
      <Container>
        <div className='portfolio__container'>
          <div className='mt-5 d-flex align-items-center justify-content-center flex-column'>
            <h4>My Portfolio</h4>
            <button className='btn_brand sdfdsf' onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
          <Row>
            <Col className='mb-3' sm={12} md={12} lg={4} xl={4}>
              <div className='upBox '>
                <h3>Metrics</h3>
                <div className='d-flex align-items-center justify-content-between'>
                  <p>Max Supply</p>
                  <p>100,000,000</p>
                </div>
                {/* <div className='d-flex align-items-center justify-content-between'>
                  <p>CAPL Burned in USD</p>
                  <p>$252,943</p>
                </div> */}
                <div className='d-flex align-items-center justify-content-between'>
                  <p>Market Cap / TVL Ratio</p>
                  <p>1</p>
                </div>
                <div className='mt-3 d-flex justify-content-center'>
                  <button
                    onClick={() => history.push('/swap')}
                    className='btn_brand'
                  >
                    Buy CAPL
                  </button>
                </div>
              </div>
            </Col>
            <Col className='mb-3' sm={12} md={12} lg={4} xl={3}>
              <div className='upBox sfds'>
                <Image src={Logo} alt='' />
                <h6>CAPL</h6>

                <p>
                  {balanceLoading ? (
                    <ReactLoading
                      type='bars'
                      color='#ffffff'
                      height={0}
                      width={30}
                      className='load'
                    />
                  ) : (
                    numberFormate(ccptBNBBalance)
                  )}
                </p>
              </div>
            </Col>
            <Col className='mb-3' sm={12} md={12} lg={4} xl={5}>
              <div className='upBox third'>
                <h3>Holdings</h3>
                <div className='d-flex align-items-center justify-content-between flex-wrap'>
                  <div className='hleft text-start '>
                    <p>Balance In Vaults</p>
                    {/* <h5 className='redd'>{numberFormate(withdrawLpBalance)}</h5> */}
                    <h5 className='redd'>
                      {balanceLoading ? (
                        <ReactLoading
                          type='bars'
                          color='#ffffff'
                          height={0}
                          width={30}
                          className='load'
                        />
                      ) : (
                        numberFormate(withdrawLpBalance)
                      )}
                    </h5>
                  </div>
                  <div className='hright text-lg-end text-sm-start'>
                    <p>Current APY</p>
                    <h5 className='redd'>{numberFormate(apy)}%</h5>
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-between flex-wrap'>
                  <div className='hleft text-start'>
                    <p>Pending Earnings</p>
                    <h5 className='redd'>
                      {balanceLoading ? (
                        <ReactLoading
                          type='bars'
                          color='#ffffff'
                          height={0}
                          width={30}
                          className='load'
                        />
                      ) : (
                        numberFormate(vaultRewards)
                      )}
                    </h5>
                  </div>
                  <div className='hright text-lg-end text-sm-start'>
                    <p>CAPL Share</p>
                    <h5 className='redd'>
                      {balanceLoading ? (
                        <ReactLoading
                          type='bars'
                          color='#ffffff'
                          height={0}
                          width={30}
                          className='load'
                        />
                      ) : (
                        `${(Number(ccptBNBBalance) / 100000000)?.toFixed(18)} %`
                      )}
                    </h5>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          {/* <Row className='portfolio__cards__container'>
            <PortfolioCard
              bgColor='#e5def0'
              amount={`$ ${numberFormate(CCPTBalance)}`}
              text='CAPL Balance'
              icon={card_one}
            />
            <PortfolioCard
              bgColor='#D6EDD9'
              amount={numberFormate(CAPLBalance)}
              text='CCUDC balance'
              icon={card_two}
            />
            <PortfolioCard
              bgColor='#F6F0D8'
              amount={numberFormate(CRETBalance)}
              text='CRET balance'
              icon={card_three}
            />
            <PortfolioCard
              bgColor='#D8E4F6'
              amount={`$ ${numberFormate(lpCAPLBalance || a)}`}
              text='CCUDC LP Balance'
              icon={card_four}
            />
            <PortfolioCard
              bgColor='#F6D8D8'
              amount={`$ ${numberFormate(lpCRETBalance || b)}`}
              text='CRET LP Balance'
              icon={card_five}
            />
            <PortfolioCard
              bgColor='#F6D8D8'
              amount={`$ ${numberFormate(availableBalance || c)}`}
              text='USDC Balance'
              icon={card_five}
            />
            <PortfolioCard
              bgColor='#e5def0'
              amount={`$ ${numberFormate(totalRewards)}`}
              text='Total Rewards Earned'
              icon={card_one}
            />
          </Row> */}
        </div>
      </Container>
    </div>
  )
}

export default MyPortfolio
