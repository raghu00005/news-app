import React,{useEffect, useState} from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import {Typography} from '@material-ui/core';
import NewsCards from './components/NewsCards/NewsCards';
import wordsToNumbers from 'words-to-numbers';
import useStyles from './styles';

const alanKey = '8f9787f646aff7e2f6ad4c49024d0ee82e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {

    const classes = useStyles();

    const [newsArticles, setNewsArticles] = useState([]);
    const [activeArticle, setActiveArticle] = useState(-1);

    useEffect(()=> {
        alanBtn({
            key: alanKey,
            onCommand: ({ command, articles, number }) => {
                if (command=== 'newHeadlines') {
                    setNewsArticles(articles);
                    setActiveArticle(-1);
                }
                else if(command === 'highlight'){
                    setActiveArticle((prevActiveArticle) => prevActiveArticle+1);
                } 
                else if(command === 'open'){
                    const parsedNumber = number.length>2 ? wordsToNumbers(number,{fuzzy: true}) : number;
                    const article = articles[parsedNumber-1];
                    if(parsedNumber>20){
                        alanBtn().playText('Please try that again.');
                    }
                    else if(article){
                        window.open(article.url, '_blank');
                        alanBtn().playText('Opening...');
                    }
                }
            }
        })
    }, [])

    return(
        <div>
            <div className={classes.logoContainer}>
                 {newsArticles.length ? (
                    <div className={classes.infoContainer}>
                        <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
                        <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
                    </div>
                ) : null}
                <img src="https://alan.app/voice/images/previews/preview.jpg" className={classes.alanLogo} alt="logo" />
            </div>
            <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        </div>
    )
}

export default App;
