import { Button, Container } from "@mantine/core";
import { useCallback } from "react";
import { useAuth } from "../../../../stores/Auth";
import { useSocket } from "../../../../stores/Socket";

const EmployeeHomeScreen = () => {
    const [, socketAction] = useSocket();
    const [authState] = useAuth();
    const sendNotification = useCallback((userId: number) => {
        socketAction.emit("notification", {
            token: authState.token,
            userId: userId,
            content: `"Are you getting my texts???" she texted to him. He glanced at it and chuckled under his breath. Of course he was getting them, but if he wasn't getting them, how would he ever be able to answer? He put the phone down and continued on his project. He was ignoring her texts and he planned to continue to do so. They decided to find the end of the rainbow. While they hoped they would find a pot of gold, neither of them truly believed that the mythical pot would actually be there. Nor did they believe they could actually find the end of the rainbow. Still, it seemed like a fun activity for the day, and pictures of them chasing rainbows would look great on their Instagram accounts. They would have never believed they would actually find the end of a rainbow, and when they did, what they actually found there. The words hadn't flowed from his fingers for the past few weeks. He never imagined he'd find himself with writer's block, but here he sat with a blank screen in front of him. That blank screen taunting him day after day had started to play with his mind. He didn't understand why he couldn't even type a single word, just one to begin the process and build from there. And yet, he already knew that the eight hours he was prepared to sit in front of his computer today would end with the screen remaining blank.`
        })
    }, []);


    return <Container>
        <Button onClick={() => sendNotification(2000001)}>
            Test Notification
        </Button>
    </Container>
}


export default EmployeeHomeScreen;