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
        // 
        uid = "ID_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('quiz_uid', uid);
    }

    // 제출 시간 계산 ㅠ 코드 복붙해놓기
    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const userName = document.getElementById('username').value;


document.getElementById('quizForm').addEventListener('submit', function(event) {
    // 제출 시 페이지 새로고침 방지
    event.preventDefault();

    let score = 0; // 초기 점수 0점

    // 문제 1
const q1_correct_keywords = ["철거스티커 1.5m", "철거링 체결", "전용 tool", "45 밴딩", "스티커 중간 부위 절단","중간 부위 절단","철거스티커 1.5","전용 툴"]; 
    
    // 
    const q1_inputs = [
        document.getElementById('q1_in_1').value.replace(/\s+/g, ''),
        document.getElementById('q1_in_2').value.replace(/\s+/g, ''),
        document.getElementById('q1_in_3').value.replace(/\s+/g, ''),
        document.getElementById('q1_in_4').value.replace(/\s+/g, ''),
        document.getElementById('q1_in_5').value.replace(/\s+/g, '')
    ];

    let q1_matchCount = 0;

    // 정답 키워드 5개를 검사
    q1_correct_keywords.forEach(keyword => {
        // 
        const foundIndex = q1_inputs.findIndex(input => input.includes(keyword));

        if (foundIndex !== -1) {
            q1_matchCount++; // 
            //
            q1_inputs[foundIndex] = ""; 
        }
    });
    
    // 
    if (q1_matchCount === 5) {
        score += 10;
    }


   const checkRadio = (name, answer) => {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        if (checked && checked.value === answer) score += 10;
    };

    checkRadio("q2", "2"); 
    checkRadio("q3", "3"); 
    checkRadio("q4", "3"); 
    checkRadio("q5", "1"); 


    const q6_correct_keywords = ["방독면", "chemical 장갑", "보안경", "케미칼 장갑"]; 

    const q6_input = document.getElementById('q6_in').value.replace(/\s+/g, ''); 
    const q6_isCorrect = q6_correct_keywords.every(keyword => q6_input.includes(keyword));
    
    if (q6_isCorrect && q6_input.length > 0) {
        score += 10;
    }

    const q7_input = document.getElementById('q7_in').value.replace(/-/g, ''); 
    if (q7_input === "0439079999" || q7_input === "내선번호") { 
        score += 10;
    }

    checkRadio("q8", "3"); 
    checkRadio("q9", "3"); 
    checkRadio("q10", "4"); 


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
        // 백그라운드 전송 (mode: 'no-cors')
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
        alert(`합격입니다. 제출이 완료되었습니다.\n\n(최종 점수: ${score}점)`);
        submitBtn.innerText = "제출 완료";
        submitBtn.style.backgroundColor = "#999"; 
        submitBtn.style.cursor = "not-allowed";
    } else {
        alert(`현재 점수: ${score}점\n\n80점 미만이므로 재응시해야 합니다.`);
        submitBtn.innerText = "제출하기"; // 버튼 원상복구
        submitBtn.disabled = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
