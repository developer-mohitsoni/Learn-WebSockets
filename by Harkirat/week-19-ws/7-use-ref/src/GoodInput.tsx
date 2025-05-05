import { useRef } from "react";

export const GoodInput = () => {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		inputRef.current?.focus();
		console.log(inputRef.current);
	};

	return (
		<div>
			<input ref={inputRef} type="text" />
			<button type="button" onClick={handleButtonClick}>
				Focus Input
			</button>
		</div>
	);
};
