class LinkedListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

/**
 * @param {string} S
 * @return {string}
 */
function RemoveDuplicate(S, aChar) {
  if (S === null || S.length === 0) {
    return S;
  }
  const curLetter = S.charAt(0);
  const head = new LinkedListNode(curLetter);
  const finishedStringNoDuplicates = [];

  let current = head;

  for (let i = 1; i < S.length; i += 1) {
    current.next = new LinkedListNode(S.charAt(i));
    current = current.next;
  }

  current = head;
  while (current !== null) {
    console.log(`cur ${current.data}`);
    if (current.next != null && current.next.data === current.data && current.data === aChar) {
      console.log(`match ${current.data} ${current.next.data}`);
      const tempNext = current.next;
      current.next = tempNext.next;
    } else {
      current = current.next;
    }
  }

  current = head;
  while (current !== null) {
    finishedStringNoDuplicates.push(current.data);
    current = current.next;
  }

  return finishedStringNoDuplicates.join("");
}

exports.LinkedListNode = LinkedListNode;
exports.RemoveDuplicate = RemoveDuplicate;
