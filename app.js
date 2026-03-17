const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrdlnuBXKgoUw8ouggz3WobnCSjibthvxBLePGk1Ou3zdHpRQud17sQKj0-iQcvkk3AA/exec';

document.getElementById('quizForm').addEventListener('submit', async function(event) {

    event.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = "채점 중";
    submitBtn.disabled = true;

    let score = 0;
    let wrongQuestions = []; 
    let userAnswers = {};   

    let uid = localStorage.getItem('quiz_uid');
    if (!uid) {
        uid = "ID_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('quiz_uid', uid);
    }

    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const userName = document.getElementById('username').value;


    const q1_raw_inputs = [
        document.getElementById('q1_in_1').value, document.getElementById('q1_in_2').value,
        document.getElementById('q1_in_3').value, document.getElementById('q1_in_4').value, document.getElementById('q1_in_5').value
    ];
    userAnswers.ans1 = q1_raw_inputs.join(", "); 
    
 
    const q1_inputs = q1_raw_inputs.map(val => val.replace(/\s+/g, '').toLowerCase());


    const q1_concept_groups = [
        ["철거스티커1.5m", "철거스티커1.5"], // 1번 개념
        ["철거링체결"],                     // 2번 개념
        ["전용tool", "전용툴"],             // 3번 개념
        ["45밴딩"],                         // 4번 개념
        ["스티커중간부위절단", "중간부위절단"]   // 5번 개념
    ];

    let q1_matchCount = 0;
    q1_concept_groups.forEach(group => {

        const foundIndex = q1_inputs.findIndex(input => 
            group.some(synonym => input.includes(synonym))
        );

        if (foundIndex !== -1) {
            q1_matchCount++; 
            q1_inputs[foundIndex] = ""; // 중복 방지
        }
    });
    
    if (q1_matchCount === 5) { score += 10; } 
    else { wrongQuestions.push(1); }


    const checkRadio = (qNum, name, answer) => {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        userAnswers[`ans${qNum}`] = checked ? checked.value : "미입력";
        if (checked && checked.value === answer) {
            score += 10;
        } else {
            wrongQuestions.push(qNum);
        }
    };

    checkRadio(2, "q2", "2"); 
    checkRadio(3, "q3", "3"); 
    checkRadio(4, "q4", "3"); 
    checkRadio(5, "q5", "1"); 


    const q6_raw_input = document.getElementById('q6_in').value;
    userAnswers.ans6 = q6_raw_input;
    const q6_input = q6_raw_input.replace(/\s+/g, '').toLowerCase();

    // 🌟 3가지 필수품 (케미칼 장갑은 영어/한글 혼용 대비)
    const q6_concept_groups = [
        ["방독면"],
        ["보안경"],
        ["chemical장갑", "케미칼장갑"] // 둘 중 하나만 적어도 인정!
    ];

    // 모든(every) 필수품 그룹에 대해, 어느 하나라도(some) 포함되어 있는지 검사
    const q6_isCorrect = q6_concept_groups.every(group => 
        group.some(synonym => q6_input.includes(synonym))
    );
    
    if (q6_isCorrect && q6_input.length > 0) { score += 10; } 
    else { wrongQuestions.push(6); }


    const q7_raw_input = document.getElementById('q7_in').value;
    userAnswers.ans7 = q7_raw_input;
    const q7_input = q7_raw_input.replace(/-/g, ''); 

    if (q7_input === "0439079999" || q7_input === "내선번호") { score += 10; } 
    else { wrongQuestions.push(7); }


    checkRadio(8, "q8", "3"); 
    checkRadio(9, "q9", "3"); 
    checkRadio(10, "q10", "4"); 


    const payload = {
        name: userName,
        score: score,
        time: timeString,
        uid: uid,
        wrongQs: wrongQuestions.join(", "), 
        ans1: userAnswers.ans1, ans2: userAnswers.ans2, ans3: userAnswers.ans3,
        ans4: userAnswers.ans4, ans5: userAnswers.ans5, ans6: userAnswers.ans6,
        ans7: userAnswers.ans7, ans8: userAnswers.ans8, ans9: userAnswers.ans9, ans10: userAnswers.ans10
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("구글 시트 전송 중 오류 발생:", error);
    }

    if (score >= 80) {
        alert(`합격입니다! 제출이 완료되었습니다.\n\n(최종 점수: ${score}점)`);
        submitBtn.innerText = "제출 완료";
        submitBtn.style.backgroundColor = "#999"; 
        submitBtn.style.cursor = "not-allowed";
    } else {
        alert(`불합격입니다.\n\n현재 점수: ${score}점\n\n80점 미만이므로 재응시해야 합니다.`);
        submitBtn.innerText = "제출하기"; 
        submitBtn.disabled = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
