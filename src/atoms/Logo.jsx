import { useNavigate } from "react-router";

export default function Logo({ large = false, white = false }) {
	const navigate = useNavigate();
	return (
		<button
			onClick={() => navigate("/app")}
			className={`relative rounded-full
          ${large == true ? "h-[62px] w-[62px]" : "h-[46px] w-[46px]"}
          ${white == true ? "bg-white" : "bg-(--black-normal)"}
        `}
		>
			<span
				className={`absolute rounded-full
            ${large == true ? "h-[12px] w-[12px]" : "h-[8px] w-[8px]"}
            top-1/2 transform -translate-y-1/2 right-[4px]
            ${white == true ? "bg-(--black-normal)" : "bg-white"}`}
			></span>
		</button>
	);
}
