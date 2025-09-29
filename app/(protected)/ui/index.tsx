import DetailBox from "../../../components/DetailBox";

//for testing
export default function UI() {
    return (
        <DetailBox
            productName="Test"
            analysis={{
                type: "Test",
                match_percentage: "100",
                harmful_ingredients: [],
            }}
        />
    );
}
