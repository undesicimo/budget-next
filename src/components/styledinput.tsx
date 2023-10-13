export function StyledInput<
  T extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
>(props: T) {
  return (
    <input
      className="h-[2.812rem] w-full rounded-[0.56981rem] border-[0.608px] border-black bg-white text-center text-black focus:outline-none"
      {...props}
    />
  );
}
