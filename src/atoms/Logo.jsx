import { useNavigate } from "react-router";

export default function Logo(large = false) {
	const navigate = useNavigate();
	return (
		<button
			onClick={() => navigate("/app")}
			className={`relative bg-(--black-normal) rounded-full
          ${large == true ? "h-[62px] w-[62px]" : "h-[46px] w-[46px]"}
        `}
		>
			<span
				className={`absolute bg-white rounded-full
            ${large == true ? "h-[12px] w-[12px]" : "h-[8px] w-[8px]"}
            top-1/2 transform -translate-y-1/2 right-[4px]`}
			></span>
		</button>
	);
}
