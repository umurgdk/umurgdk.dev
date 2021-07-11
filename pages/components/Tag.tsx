interface Props {
    name: string;
}
export default function Tag({ name }: Props) {
    return <a className="text-gray-400 text-sm" href="#">#{name}</a>
}