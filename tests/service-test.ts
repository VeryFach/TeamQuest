import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig.node";
import { ChatService } from "../services/chat.service";
import { GroupService } from "../services/group.service";
import { ProjectService } from "../services/project.service";
import { TaskService } from "../services/task.service";

async function main() {
  try {
    console.log("=== TEST SERVICE ===");

    // Login dulu
    console.log("Logging in...");
    await signInWithEmailAndPassword(auth, "admin@admin.com", "password123");
    console.log("✅ Logged in successfully\n");

    // test — create group
    const group = await GroupService.createGroup({
      name: "Test Squad",
      leaderId: auth.currentUser!.uid,
      members: [auth.currentUser!.uid],
    });
    console.log("Group created:", group);

    // test — create project
    const project = await ProjectService.createProject({
      name: "Test Project",
      isPrivate: false,
      groupId: group.id,
      projectLeader: auth.currentUser!.uid,
      reward: { name: "XP 10", icon: "🔥" },
    });
    console.log("Project created:", project);

    // test — create task
    const task = await TaskService.createTask({
      projectId: project.projectId,
      taskName: "Do homework",
      assignedTo: auth.currentUser!.uid,
      isDone: false,
    });
    console.log("Task created:", task);

    // test — get tasks
    const tasks = await TaskService.getTasks(project.projectId);
    console.log("Task list:", tasks);

    // test — update task
    await TaskService.updateTask(task.taskId, { isDone: true });
    console.log("Task marked as done ✔");

    // test — read updated tasks
    const tasks2 = await TaskService.getTasks(project.projectId);
    console.log("After update:", tasks2);

    // test — send message to group
    console.log("\n=== TESTING CHAT ===");
    await ChatService.sendMessage({
      groupId: group.id,
      userId: auth.currentUser!.uid,
      userName: "Admin User",
      text: "Hello, this is a test message!",
    });
    console.log("✅ Message sent to group");

    // test — subscribe to messages
    console.log("Subscribing to messages...");
    const unsubscribe = ChatService.subscribeToMessages(
      group.id,
      (messages) => {
        console.log(`📩 Received ${messages.length} message(s):`);
        messages.forEach((msg) => {
          console.log(`  - ${msg.userName}: ${msg.text}`);
        });
      }
    );

    // Wait 2 seconds to receive messages
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Send another message
    await ChatService.sendMessage({
      groupId: group.id,
      userId: auth.currentUser!.uid,
      userName: "Admin User",
      text: "Second test message!",
    });

    // Wait to receive the second message
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Unsubscribe
    unsubscribe();
    console.log("✅ Unsubscribed from messages");

    console.log("\n✅ All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

main();
