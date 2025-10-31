const button = document.createElement("button");
let video = document.querySelector("video");
button.innerText = "Skip Video";
button.style.position = "absolute";
button.style.left = "10px";
button.style.top = "100px";
button.style.backgroundColor = "red";
button.style.color = "white";
button.style.border = "none";
button.style.padding = "10px";
button.style.cursor = "pointer";

document.body.appendChild(button);

let questionTimes = [];
let nextTimeIndex = 0;
let finished = false;

function processTime(postQuestionResumeTime) {
    const timeString = postQuestionResumeTime.replace("PT", "");
    const timeParts = timeString.match(/(\d+)M(\d+\.\d+)S/);
    if (timeParts) {
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseFloat(timeParts[2]);
        const totalSeconds = Math.floor(minutes * 60 + seconds) - 1;
        questionTimes.push(totalSeconds);
        console.log(totalSeconds);
    } else {
        const seconds = parseFloat(timeString.replace("S", ""));
        const totalSeconds = Math.floor(seconds) - 1;
        questionTimes.push(totalSeconds);
        console.log(totalSeconds);
    }
}

const makeApiRequest = () => {
    video = document.querySelector("video")
    const url = window.location.href;
    const urlParts = url.split('/');
    const moduleUniqueCode = urlParts[4];
    const subsectionUniqueCode = urlParts[5];
    const uniqueCode = urlParts[6];

    const match = document.cookie.match(new RegExp('(^|;\\s*)' + "auth-token" + '=([^;]*)'));
    const auth = match ? decodeURIComponent(match[2]) : null;

    fetch("https://web.uplearn.co.uk/api/", {
        headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "authorization": `Bearer ${auth}`
        },
        credentials: "include",
        body: JSON.stringify({
            operationName: "GetVideoLesson",
            variables: {
                moduleUniqueCode,
                subsectionUniqueCode,
                uniqueCode,
                inVideoQuestionOrder: [{
                    field: "TRIGGER_TIME",
                    direction: "ASC"
                }]
            },
            query: `
            query GetVideoLesson(
                $uniqueCode: String!, 
                $subsectionUniqueCode: String!, 
                $moduleUniqueCode: String!, 
                $inVideoQuestionFilter: InVideoQuestionFilter, 
                $inVideoQuestionOrder: [InVideoQuestionOrdering]
            ) {  
                videoLesson(filter: {
                    uniqueCode: $uniqueCode, 
                    subsectionUniqueCode: $subsectionUniqueCode, 
                    moduleUniqueCode: $moduleUniqueCode
                }) {    id    module {      id      uniqueCode      title      examBoardSubject {        subject: subjectObject {          qualification {            uniqueCode            __typename          }          __typename        }        __typename      }      __typename    }    subsection {      id      name      uniqueCode      __typename    }    wistiaId    uniqueCode    title    length    duration    extraContent    skipRecapStartTime    preVideoQuestions {      __typename      id      quizContent {        ...UnmarkedQuestion        __typename      }    }    inVideoQuizQuestions(      filter: $inVideoQuestionFilter      order: $inVideoQuestionOrder    ) {      __typename      id      triggerTime      postQuestionResumeTime      quizContent {        __typename        ...UnmarkedQuestion      }    }    __typename  }}fragment UnmarkedQuestion on QuizContent {  __typename  id  stem  quizDefinition {    __typename    questions {      ...UnmarkedQuestionPart      __typename    }  }}fragment UnmarkedQuestionPart on QuizQuestion {  __typename  ... on MultipleChoiceQuestion {    question    description    image    topImage    options {      text      image      __typename    }    __typename  }  ... on MultiMultipleChoiceQuestion {    question    description    image    topImage    options {      text      image      __typename    }    __typename  }  ... on TextQuestion {    question    description    image    topImage    beforeText    afterText    __typename  }  ... on NumericalQuestion {    question    description    image    topImage    beforeText    afterText    __typename  }  ... on MathsQuestion {    question    description    image    topImage    __typename  }  ... on MultipleInputQuestion {    questionSegments {      type: __typename      ... on MultipleInputQuestionText {        text        __typename      }      ... on MultipleInputQuestionBlank {        fieldIndex        __typename      }    }    description    image    topImage    __typename  }  ... on ChemistryQuestion {    question    description    image    topImage    __typename  }  ... on DropdownQuestion {    question    description    image    topImage    dropdownOptions    __typename  }  ... on DrawQuestion {    question    description    image    topImage    drawOn    __typename  }  ... on EngageQuestion {    question    description    image    topImage    __typename  
                }
            }
            `
        }),
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        const info = data.data.videoLesson.inVideoQuizQuestions;

        for (let question of info) {
            processTime(question.postQuestionResumeTime);
        }

        if (questionTimes.length > 0) {
            video.currentTime = questionTimes[nextTimeIndex];
        }

        video.addEventListener('timeupdate', () => {
            if (finished) { return; }
            const currentTime = video.currentTime;
            console.log("Current Time:", currentTime, "Next Time:", questionTimes[nextTimeIndex]);

            if (nextTimeIndex < questionTimes.length) {
                if (currentTime - 2 >= questionTimes[nextTimeIndex]) {
                    console.log(`Skipping to: ${questionTimes[nextTimeIndex]} seconds`);
                    nextTimeIndex++;

                    if (nextTimeIndex < questionTimes.length) {
                        video.currentTime = questionTimes[nextTimeIndex] - 1;
                    } else {
                        console.log("No more questions. Skipping to the end of the video.");
                        video.currentTime = video.duration - 0.5;
                    }
                }
            } else {
                console.log("Next time index is out of bounds. Skipping to the end of the video.");
                video.currentTime = video.duration - 0.5;
            }

            if (currentTime >= video.duration - 0.5) {
                finished = true;
                console.log("Reached near the end. Stopping playback.");
            }
        });
    })
    .catch(error => console.error("Error:", error));
};

button.addEventListener("click", makeApiRequest);
