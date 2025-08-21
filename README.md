Random Student Picker
=====================

Open `settings.html` first to add students. Then use `index.html` (the picker) to randomly choose students fairly.

Fairness rule: A student is always chosen uniformly among those with the *lowest* pick count so far, ensuring no student is picked for a 4th time before every student has reached 4 picks (and this extends generally for any number of rounds).

Data is stored locally in your browser `localStorage` under the key `rsp:data`.

Files:
* `index.html` – Picker with dice animation (1.5s) then displays the chosen student.
* `settings.html` – Manage student list, rename/delete, view counts and full pick history.
* `storage.js` – Shared data + fairness logic.
* `styles.css` – Basic styling + dice animation.

No build step required. Just double‑click the HTML files.
