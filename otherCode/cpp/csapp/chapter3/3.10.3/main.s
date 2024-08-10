	.file	"main.c"
	.text
	.globl	main
	.type	main, @function
main:
.LFB11:
	.cfi_startproc
	movl	$0, %eax
	ret
	.cfi_endproc
.LFE11:
	.size	main, .-main
	.globl	gets
	.type	gets, @function
gets:
.LFB12:
	.cfi_startproc
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset 6, -16
	pushq	%rbx
	.cfi_def_cfa_offset 24
	.cfi_offset 3, -24
	subq	$8, %rsp
	.cfi_def_cfa_offset 32
	movq	%rdi, %rbp
	movq	%rdi, %rbx
	jmp	.L3
.L5:
	movb	%al, (%rbx)
	leaq	1(%rbx), %rbx
.L3:
	movq	stdin(%rip), %rdi
	call	getc@PLT
	cmpl	$10, %eax
	je	.L4
	cmpl	$-1, %eax
	jne	.L5
.L4:
	cmpl	$-1, %eax
	sete	%dl
	cmpq	%rbp, %rbx
	sete	%al
	testb	%al, %dl
	jne	.L7
	movb	$0, (%rbx)
	movq	%rbp, %rax
.L2:
	addq	$8, %rsp
	.cfi_remember_state
	.cfi_def_cfa_offset 24
	popq	%rbx
	.cfi_def_cfa_offset 16
	popq	%rbp
	.cfi_def_cfa_offset 8
	ret
.L7:
	.cfi_restore_state
	movl	$0, %eax
	jmp	.L2
	.cfi_endproc
.LFE12:
	.size	gets, .-gets
	.globl	echo
	.type	echo, @function
echo:
.LFB13:
	.cfi_startproc
	pushq	%rbx
	.cfi_def_cfa_offset 16
	.cfi_offset 3, -16
	subq	$16, %rsp
	.cfi_def_cfa_offset 32
	leaq	8(%rsp), %rbx
	movq	%rbx, %rdi
	call	gets
	movq	%rbx, %rdi
	call	puts@PLT
	addq	$16, %rsp
	.cfi_def_cfa_offset 16
	popq	%rbx
	.cfi_def_cfa_offset 8
	ret
	.cfi_endproc
.LFE13:
	.size	echo, .-echo
	.ident	"GCC: (Debian 10.2.1-6) 10.2.1 20210110"
	.section	.note.GNU-stack,"",@progbits
