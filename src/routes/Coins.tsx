import { Helmet } from "react-helmet-async";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import Switch from "react-switch";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
    padding:0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;
const Header = styled.header`
    height:10vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const SwitchBox = styled.div`
    display:flex;
    margin-top:30px;
    justify-content: right;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 48px;
    color:${props => props.theme.accentColor};
`;
const CoinList = styled.ul`
    
`;

const Coin = styled.li`
    background-color: ${props => props.theme.bgColor};
    color: ${props => props.theme.textColor};
    border: 1px solid ${props => props.theme.textColor};
    margin-bottom: 10px;
    border-radius: 15px;
    a{
        display:flex;
        padding: 15px;
        align-items: center;
        transition: color .2s ease-in;
    }
    &:hover{
        a{
            color:${props => props.theme.accentColor};
        }
    }
`;
const Loader = styled.span`
    text-align: center;
    display: block;
`;
const Img = styled.img<ImgInterface>`
    width:35px;
    height:35px;
    margin-right: 10px;
`;

interface ImgInterface {
    src: string,
}

interface ICoin {
    id: string,
    name: string,
    symbol: string,
    rank: number,
    is_new: boolean,
    is_active: boolean,
    type: string,
}
interface ICoinsProps {
}
//<button onClick={toggleDarkAtom}>Toggle Mode</button>
function Coins({ }: ICoinsProps) {
    const isDark = useRecoilValue(isDarkAtom);
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
    const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
    return (
        <Container>
            <Helmet>
                <title>Coin</title>
            </Helmet>
            <SwitchBox>
                <Switch
                    onChange={toggleDarkAtom}
                    checked={isDark}
                    handleDiameter={15}
                    height={18}
                    width={40}
                    onColor={"#fdcb6e"}
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
            </SwitchBox>
            <Header>
                <Title>COIN</Title>
            </Header>
            {isLoading ? <Loader>Loading...</Loader> : (
                <CoinList>
                    {data?.map(
                        coin =>
                            <Coin key={coin.id}>
                                <Link
                                    to={`/${coin.id}`}
                                    state={{ name: coin.name }}>
                                    <Img src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`} />
                                    {coin.name} &rarr;
                                </Link>
                            </Coin>)}
                </CoinList>)}
        </Container>
    );
}
export default Coins;