(function() {
    var game_start = document.getElementById("game_start"),
        game = document.getElementById("game"),
        game_end = document.getElementById("game_end"),
        
        button_start_game = document.getElementsByClassName("button_start_game")[0],
        button_new_game = document.getElementsByClassName("button_new_game")[0],
        button_retry_game = document.getElementsByClassName("button_retry_game")[0],
        
        scores_value = document.getElementsByClassName("scores_value"),
        game_field = document.getElementsByClassName("game_field")[0],
        card = document.getElementsByClassName("card"),
        face_card = document.getElementsByClassName("face_card"),
	
        deck = ["2", "3", "4", "5", "6", "7", "8", "9", "0", "jack", "queen", "king", "ace"],
        field = new Array(18),
        suit = ["hearts", "diamonds", "clubs", "spades"],
        field_txt = "",

        open_card, // Порядковый номер карты на которую нажали
        compare_card, // Предыдущий номер карты на которую нажали
        delay = 1000,
        count_scores = 0, // Счетчик очков
        pair_cards = field.length / 2, // Счетчик парных карт
        let_click = false, // Позволять нажимать на карты
        count_click = false; // Счетчик нажатий. 0 и 1.

// Функция которая перемешивает колоду и возвращает ее
	
	function mix(arr) {
		var mass = [], ind = 0;
		for (var i = 0, m = arr.length; m > 0; i++, m--) {
			ind = Math.floor(Math.random() * m);
			mass[i] = arr[ind];
			arr.splice(ind, 1);
		}
		for (var i = 0; i < mass.length; i++) {
			arr[i] = mass[i];
		}
		return arr;
	}
	
// Функция для события навешиваемого на карты
	
	function turn() {
		if (let_click) {
			
			// Определим карту на которую было нажатие

			for (var i = 0; i < card.length; i++) {
				if (card[i] == this) {
					 open_card = i;
					break;
				}
			}
			
			// Проверим карты на совподения
			
			if (count_click && compare_card != open_card) { // Второе нажатие
				if (field[compare_card].id == field[open_card].id) {
					count_scores += pair_cards * 42;
					pair_cards--;
					scores_value[0].textContent = count_scores;
					
					this.setAttribute("data-tid", "Card-flipped");
					card[compare_card].setAttribute("data-tid", "Card-flipped");
					this.removeEventListener("click", turn); // Снимем обработчик
					card[compare_card].removeEventListener("click", turn);
					
					// Поставим задержку сюда

					let_click = false;
					setTimeout(function() {
						let_click = true;
						card[open_card].style.visibility = "hidden";
						card[compare_card].style.visibility = "hidden";
					}, delay);
					card[open_card].classList.add("flipped");
				} else {
					count_scores -= (field.length / 2 - pair_cards) * 42;
//					if (count_scores < 0) {
//						count_scores = 0;
//					}
					scores_value[0].textContent = count_scores;
					this.setAttribute("data-tid", "Card");
					card[compare_card].setAttribute("data-tid", "Card");
					
					// Поставим задержку и сюда
					
					let_click = false;
					setTimeout(function() {
						let_click = true;
						card[open_card].classList.remove("flipped");
                        card[compare_card].classList.remove("flipped");
					}, delay);
					card[open_card].classList.add("flipped");
				}
				count_click = false;
				
			} else {  // Действие при первом нажатии
				compare_card = open_card;
				this.setAttribute("data-tid", "Card-flipped");

				card[open_card].classList.add("flipped");
				count_click = true;
			}
            
            if (pair_cards <= 0) {
                setTimeout(function() {
                    game_end.style.display = "block";
                    game.style.display = "none";
                    scores_value[1].textContent = count_scores;
                }, 2500);
            }
		}
		
	}
	
// Функция новой игры
	
	function new_game() {
		field_txt = "";
		
		count_scores = 0; // Счетчик очков
		pair_cards = field.length / 2; // Счетчик парных карт
		let_click = false; // Позволять нажимать на карты
		count_click = false; // Счетчик нажатий. 0 и 1.
		
		scores_value[0].textContent = count_scores;
		
		// Размешаем колоду

		mix(deck);
		
		// Разложим карты

		for (var i = 0; i < field.length; i++) {
			field[i] = {id: "", suit: ""};
		}
		for (var i = 0, j = 0; i < field.length; i += 2, j++) {
			field[i].id = deck[j];
			mix(suit);
			field[i].suit = suit[0];
			field[i + 1].id = deck[j];
			field[i + 1].suit = suit[0];
		}
		mix(field);
		
		// Графически выведем

		for (var i = 0; i < field.length; i++) {
			field_txt += '<div class="wrapper"><div class="card"><figure class="back_card"></figure><figure class="face_card"></figure></div></div>';
		}
		game_field.innerHTML = field_txt;
        
        for (var i = 0; i < field.length; i++) {
			face_card[i].style.backgroundImage = "url(images/Cards/" + field[i].id[0].toUpperCase() + field[i].suit[0].toUpperCase() + ".png)";
			
			// Добавим событие

			card[i].addEventListener("click", turn);
		}
        
        setTimeout(function() {
            for (var i = 0; i < field.length; i++) {
				card[i].classList.add("flipped");
			}
		}, 500);
        
        // Графически перевернем карты рубашкой вверх

		setTimeout(function() {
			for (var i = 0; i < field.length; i++) {
				let_click = true;
				card[i].classList.remove("flipped");
			}
		}, 6000);
		
	}
	
    button_start_game.onclick = function () {
        game_start.style.display = "none";
        game.style.display = "block";
        new_game();
    };
    
    button_new_game.onclick = function () {
        new_game();
    };
    
    button_retry_game.onclick = function () {
        game_end.style.display = "none";
        game.style.display = "block";
        new_game();
    };
	
})();

/* 
		new Image
		onload

*/