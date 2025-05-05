import { useRef } from "react";

export const BadInput = () => {
	const inputRef = useRef(null);

	const handleButtonClick = () => {
		const inputElement = document.getElementById("input");
		if (inputElement) {
			inputElement.focus();
		}
	};

	return (
		<div>
			<input id={"input"} type="text" />
			<button type="button" onClick={handleButtonClick}>
				Focus Input
			</button>
		</div>
	);
};
